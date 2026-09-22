from fastapi import APIRouter
from pydantic import BaseModel

from app.services.demand_forecast_service import predict_next_month
from app.services.fuel_service import get_fuel_status


router = APIRouter()


class Perturbation(BaseModel):
    type: str
    magnitude: float
    startDay: int
    durationDays: int


class ScenarioRequest(BaseModel):
    id: str
    name: str
    createdAt: str
    durationDays: int
    perturbations: list[Perturbation]
    baselineSource: str


def is_active(
    perturbation: Perturbation,
    day: int,
) -> bool:

    end_day = (
        perturbation.startDay
        + perturbation.durationDays
        - 1
    )

    return (
        perturbation.startDay
        <= day
        <= end_day
    )


@router.post("/scenarios/run")
def run_scenario(request: ScenarioRequest):

    # -----------------------------------------
    # Get baseline data
    # -----------------------------------------

    forecast = predict_next_month()
    fuel = get_fuel_status()

    baseline_monthly_kwh = forecast["forecast_kwh"]

    baseline_average_kw = (
        baseline_monthly_kwh / (30 * 24)
    )

    baseline_fuel_litres = fuel["totalLitres"]

    baseline_daily_fuel = (
        fuel["dailyBurnRateL"]["value"]
    )

    baseline_fuel_days = (
        fuel["daysRemaining"]["value"]
    )

    # -----------------------------------------
    # Scenario-level assumptions
    # -----------------------------------------

    assumptions = [
        "Baseline demand comes from the trained Random Forest forecast.",
        "Fuel baseline comes from historical Mawson fuel consumption.",
        "Battery behavior is represented using a simplified planning model.",
        "Generator dispatch and battery chemistry are not physically simulated.",
    ]

    for perturbation in request.perturbations:

        p_type = perturbation.type
        magnitude = perturbation.magnitude

        if p_type == "temp_drop":

            assumptions.append(
                f"Temperature drop of {abs(magnitude):.1f}°C "
                "is modeled as increased electrical demand "
                "during the configured event window."
            )

        elif p_type == "solar_loss":

            assumptions.append(
                f"Solar availability is reduced by "
                f"{magnitude:.1f}% during the configured event window."
            )

        elif p_type == "genset_outage":

            assumptions.append(
                f"{int(magnitude)} genset outage(s) "
                "are represented as additional system stress "
                "during the configured event window."
            )

        elif p_type == "blizzard":

            assumptions.append(
                f"Blizzard severity of {magnitude:.1f} kt "
                "reduces solar availability and increases load stress "
                "during the configured event window."
            )

        elif p_type == "resupply_delay":

            assumptions.append(
                f"Resupply delay of {int(magnitude)} days "
                "is included in the fuel-risk assessment."
            )

    # -----------------------------------------
    # Scenario-level demand calculation
    # -----------------------------------------

    overall_demand_multiplier = 1.0
    overall_solar_multiplier = 1.0
    genset_outage = 0
    resupply_delay = 0

    for perturbation in request.perturbations:

        p_type = perturbation.type
        magnitude = perturbation.magnitude

        if p_type == "temp_drop":

            overall_demand_multiplier += (
                abs(magnitude) * 0.02
            )

        elif p_type == "solar_loss":

            overall_solar_multiplier *= max(
                1 - magnitude / 100,
                0,
            )

        elif p_type == "genset_outage":

            genset_outage += int(magnitude)

            overall_demand_multiplier += (
                0.05 * int(magnitude)
            )

        elif p_type == "blizzard":

            wind_effect = min(
                magnitude / 1000,
                0.10,
            )

            overall_demand_multiplier += wind_effect

            overall_solar_multiplier *= 0.70

        elif p_type == "resupply_delay":

            resupply_delay += int(magnitude)

    scenario_average_kw = (
        baseline_average_kw
        * overall_demand_multiplier
    )

    scenario_monthly_kwh = (
        baseline_monthly_kwh
        * overall_demand_multiplier
    )

    # -----------------------------------------
    # Timeline simulation
    # -----------------------------------------

    timeline = []

    starting_soc = 80.0
    cumulative_fuel_used = 0.0

    daily_fuel_values = []

    for day in range(
        1,
        request.durationDays + 1,
    ):

        # Start each day from baseline conditions.
        day_demand_multiplier = 1.0
        day_solar_multiplier = 1.0
        day_genset_outage = 0
        day_has_stress = False

        # -------------------------------------
        # Apply only perturbations active today
        # -------------------------------------

        for perturbation in request.perturbations:

            if not is_active(
                perturbation,
                day,
            ):
                continue

            p_type = perturbation.type
            magnitude = perturbation.magnitude

            day_has_stress = True

            if p_type == "temp_drop":

                day_demand_multiplier += (
                    abs(magnitude) * 0.02
                )

            elif p_type == "solar_loss":

                day_solar_multiplier *= max(
                    1 - magnitude / 100,
                    0,
                )

            elif p_type == "genset_outage":

                day_genset_outage += int(magnitude)

                day_demand_multiplier += (
                    0.05 * int(magnitude)
                )

            elif p_type == "blizzard":

                wind_effect = min(
                    magnitude / 1000,
                    0.10,
                )

                day_demand_multiplier += (
                    wind_effect
                )

                day_solar_multiplier *= 0.70

        # -------------------------------------
        # Daily load
        # -------------------------------------

        day_load_kw = (
            baseline_average_kw
            * day_demand_multiplier
        )

        # -------------------------------------
        # Daily fuel consumption
        # -------------------------------------

        day_fuel_burn = (
            baseline_daily_fuel
            * day_demand_multiplier
        )

        cumulative_fuel_used += day_fuel_burn

        fuel_remaining = max(
            baseline_fuel_litres
            - cumulative_fuel_used,
            0,
        )

        daily_fuel_values.append(
            day_fuel_burn
        )

        # -------------------------------------
        # Battery planning model
        # -------------------------------------

        daily_soc_change = (
            2.0 * day_solar_multiplier
            - 2.5 * day_demand_multiplier
        )

        if day_genset_outage > 0:

            daily_soc_change -= (
                1.0 * day_genset_outage
            )

        if day == 1:

            battery_soc = max(
                0,
                min(
                    100,
                    starting_soc
                    + daily_soc_change,
                ),
            )

        else:

            previous_soc = timeline[-1][
                "batterySoCPercent"
            ]

            battery_soc = max(
                0,
                min(
                    100,
                    previous_soc
                    + daily_soc_change,
                ),
            )

        # -------------------------------------
        # Severity
        # -------------------------------------

        severity = "NOMINAL"

        if (
            fuel_remaining <= 0
        ):

            severity = "CRITICAL"

        elif (
            battery_soc < 30
            or day_genset_outage > 0
        ):

            severity = "WATCH"

        elif day_has_stress:

            severity = "WATCH"

        elif (
            resupply_delay > 0
            and day <= resupply_delay
        ):

            severity = "WATCH"

        # -------------------------------------
        # Timeline point
        # -------------------------------------

        timeline.append(
            {
                "day": day,
                "loadKw": float(
                    day_load_kw
                ),
                "batterySoCPercent": float(
                    battery_soc
                ),
                "fuelLitres": float(
                    fuel_remaining
                ),
                "severity": severity,
            }
        )

    # -----------------------------------------
    # Scenario fuel assessment
    # -----------------------------------------

    if daily_fuel_values:

        average_scenario_daily_fuel = (
            sum(daily_fuel_values)
            / len(daily_fuel_values)
        )

    else:

        average_scenario_daily_fuel = (
            baseline_daily_fuel
        )

    scenario_fuel_days = (
        baseline_fuel_litres
        / average_scenario_daily_fuel
    )

    effective_fuel_days = (
        scenario_fuel_days
        - resupply_delay
    )

    # -----------------------------------------
    # Determine outcome
    # -----------------------------------------

    if effective_fuel_days <= 0:

        outcome = "FUEL_CRITICAL"

        fuel_critical_day = 1

    elif effective_fuel_days < request.durationDays:

        outcome = "FUEL_CRITICAL"

        fuel_critical_day = max(
            1,
            int(round(effective_fuel_days)),
        )

    elif genset_outage > 0:

        outcome = "LOAD_SHED_REQUIRED"

        fuel_critical_day = None

    else:

        outcome = "SURVIVES"

        fuel_critical_day = None

    # -----------------------------------------
    # Return frontend-compatible result
    # -----------------------------------------

    return {
        "scenarioId": request.id,

        "outcome": outcome,

        "fuelCriticalOnDay": fuel_critical_day,

        "timeline": timeline,

        "assumptions": assumptions,

        "meta": {
            "source": "DERIVED",
            "stationId": "mawson",
            "baselineDemandKwh": float(
                baseline_monthly_kwh
            ),
            "scenarioDemandKwh": float(
                scenario_monthly_kwh
            ),
            "baselineFuelDays": float(
                baseline_fuel_days
            ),
            "scenarioFuelDays": float(
                scenario_fuel_days
            ),
        },
    }