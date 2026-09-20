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

    # Current fuel service structure
    baseline_fuel_litres = fuel["totalLitres"]

    baseline_daily_fuel = (
        fuel["dailyBurnRateL"]["value"]
    )

    baseline_fuel_days = (
        fuel["daysRemaining"]["value"]
    )

    # -----------------------------------------
    # Scenario parameters
    # -----------------------------------------

    demand_multiplier = 1.0
    solar_multiplier = 1.0
    genset_outage = 0
    resupply_delay = 0

    assumptions = [
        "Baseline demand comes from the trained Random Forest forecast.",
        "Fuel baseline comes from historical Mawson fuel consumption.",
        "Battery behavior is represented using a simplified planning model.",
        "Generator dispatch and battery chemistry are not physically simulated.",
    ]

    # -----------------------------------------
    # Apply perturbations
    # -----------------------------------------

    for perturbation in request.perturbations:

        p_type = perturbation.type
        magnitude = perturbation.magnitude

        if p_type == "temp_drop":

            temperature_effect = abs(magnitude) * 0.02

            demand_multiplier += temperature_effect

            assumptions.append(
                f"Temperature drop of {abs(magnitude):.1f}°C "
                "is modeled as increased electrical demand."
            )

        elif p_type == "solar_loss":

            solar_multiplier *= max(
                1 - magnitude / 100,
                0,
            )

            assumptions.append(
                f"Solar availability is reduced by "
                f"{magnitude:.1f}% during the event."
            )

        elif p_type == "genset_outage":

            genset_outage += int(magnitude)

            demand_multiplier += (
                0.05 * int(magnitude)
            )

            assumptions.append(
                f"{int(magnitude)} genset outage(s) "
                "are represented as additional system stress."
            )

        elif p_type == "blizzard":

            wind_effect = min(
                magnitude / 1000,
                0.10,
            )

            demand_multiplier += wind_effect

            solar_multiplier *= 0.70

            assumptions.append(
                f"Blizzard severity of {magnitude:.1f} kt "
                "reduces solar availability and increases load stress."
            )

        elif p_type == "resupply_delay":

            resupply_delay += int(magnitude)

            assumptions.append(
                f"Resupply delay of {int(magnitude)} days "
                "is included in the fuel-risk assessment."
            )

    # -----------------------------------------
    # Scenario demand
    # -----------------------------------------

    scenario_average_kw = (
        baseline_average_kw
        * demand_multiplier
    )

    scenario_monthly_kwh = (
        baseline_monthly_kwh
        * demand_multiplier
    )

    # -----------------------------------------
    # Scenario fuel consumption
    # -----------------------------------------

    scenario_daily_fuel = (
        baseline_daily_fuel
        * demand_multiplier
    )

    scenario_fuel_days = (
        baseline_fuel_litres
        / scenario_daily_fuel
    )

    # Resupply delay increases exposure.
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
    # Timeline
    # -----------------------------------------

    timeline = []

    starting_soc = 80.0

    for day in range(
        1,
        request.durationDays + 1,
    ):

        fuel_used = (
            scenario_daily_fuel * day
        )

        fuel_remaining = max(
            baseline_fuel_litres - fuel_used,
            0,
        )

        # Simplified battery planning model.
        solar_support = solar_multiplier

        daily_soc_change = (
            2.0 * solar_support
            - 2.5 * demand_multiplier
        )

        battery_soc = max(
            0,
            min(
                100,
                starting_soc
                + daily_soc_change * day,
            ),
        )

        severity = "NOMINAL"

        if (
            fuel_critical_day is not None
            and day >= fuel_critical_day
        ):
            severity = "CRITICAL"

        elif (
            battery_soc < 30
            or (
                resupply_delay > 0
                and day <= resupply_delay
            )
        ):
            severity = "WATCH"

        timeline.append(
            {
                "day": day,
                "loadKw": float(
                    scenario_average_kw
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