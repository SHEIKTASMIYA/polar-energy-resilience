from pathlib import Path
from datetime import timedelta

import pandas as pd


DATA_PATH = (
    Path(__file__).resolve().parents[2]
    / "data"
    / "mawson_energy_master_2001_2016.csv"
)


_CACHED_FUEL_DF = None

def get_fuel_status():
    global _CACHED_FUEL_DF
    if _CACHED_FUEL_DF is None:
        df = pd.read_csv(DATA_PATH)
        df["Date"] = pd.to_datetime(df["Date"])
        df = df.sort_values("Date").reset_index(drop=True)
        _CACHED_FUEL_DF = df
    df = _CACHED_FUEL_DF
    latest = df.iloc[-1]

    # Use the latest 12 historical observations
    # to estimate the normal fuel burn rate.
    recent = df.tail(12)

    average_monthly_fuel = (
        recent["Fuel_L"].mean()
    )

    average_daily_fuel = (
        average_monthly_fuel / 30
    )

    # Demonstration reserve assumption.
    # This is NOT live tank telemetry.
    fuel_reserve_l = 50000.0

    days_remaining = (
        fuel_reserve_l / average_daily_fuel
    )

    # Simple sensitivity range around the historical
    # burn rate. This is a derived planning range,
    # not a statistical confidence interval.
    low_burn_rate = average_daily_fuel * 0.90
    high_burn_rate = average_daily_fuel * 1.10

    days_remaining_low = (
        fuel_reserve_l / high_burn_rate
    )

    days_remaining_high = (
        fuel_reserve_l / low_burn_rate
    )

    # Build a 60-day fuel drawdown projection.
    survival_curve = []

    start_date = latest["Date"]

    for day in range(0, 61, 5):
        projected_litres = max(
            fuel_reserve_l
            - average_daily_fuel * day,
            0,
        )

        low_projected = max(
            fuel_reserve_l
            - high_burn_rate * day,
            0,
        )

        high_projected = max(
            fuel_reserve_l
            - low_burn_rate * day,
            0,
        )

        projection_date = (
            start_date
            + timedelta(days=day)
        )

        survival_curve.append(
            {
                "date": projection_date.strftime(
                    "%Y-%m-%d"
                ),
                "projectedLitres": {
                    "value": float(
                        projected_litres
                    ),
                    "low": float(
                        low_projected
                    ),
                    "high": float(
                        high_projected
                    ),
                },
            }
        )

    # Risk is based only on the derived
    # reserve-duration estimate.
    if days_remaining < 30:
        risk_flag = "CRITICAL"
    elif days_remaining < 45:
        risk_flag = "WATCH"
    else:
        risk_flag = "NOMINAL"

    return {
        "tanks": [
            {
                "id": "demonstration-reserve",
                "name": "Demonstration Fuel Reserve",
                "currentLitres": float(
                    fuel_reserve_l
                ),
                "capacityLitres": float(
                    fuel_reserve_l
                ),
            }
        ],

        "totalLitres": float(
            fuel_reserve_l
        ),

        "dailyBurnRateL": {
            "value": float(
                average_daily_fuel
            ),
            "low": float(
                low_burn_rate
            ),
            "high": float(
                high_burn_rate
            ),
        },

        "daysRemaining": {
            "value": float(
                days_remaining
            ),
            "low": float(
                days_remaining_low
            ),
            "high": float(
                days_remaining_high
            ),
        },

        "survivalCurve": survival_curve,

        # No verified resupply schedule is available
        # in the current dataset.
        "nextResupply": None,

        "riskFlag": risk_flag,

        "meta": {
            "source": "AADC",
            "stationId": "mawson",
            "latestHistoricalDate": (
                latest["Date"].strftime(
                    "%Y-%m-%d"
                )
            ),
            "dataType": (
                "historical fuel consumption"
            ),
            "reserveType": (
                "demonstration assumption"
            ),
            "uncertaintyMethod": (
                "10% burn-rate sensitivity range"
            ),
        },
    }