from pathlib import Path

import joblib
import pandas as pd

from app.services.weather_service import (
    get_monthly_environmental_input,
)


MODEL_PATH = (
    Path(__file__).resolve().parents[2]
    / "ml"
    / "demand_forecaster.pkl"
)

DATA_PATH = (
    Path(__file__).resolve().parents[2]
    / "data"
    / "mawson_energy_master_2001_2016.csv"
)


FEATURE_NAMES = [
    "Electricity_Lag1",
    "Electricity_Lag2",
    "Electricity_Lag3",
    "Electricity_Lag12",
    "Temperature_C",
    "Solar_kWh_m2_day",
    "Month",
]


model = joblib.load(MODEL_PATH)


_CACHED_DF = None

def load_energy_data():
    global _CACHED_DF
    if _CACHED_DF is None:
        df = pd.read_csv(DATA_PATH)
        df["Date"] = pd.to_datetime(df["Date"])
        df = df.sort_values("Date").reset_index(drop=True)
        _CACHED_DF = df
    return _CACHED_DF.copy()


def prepare_features(df):
    df = df.copy()

    df["Electricity_Lag1"] = (
        df["Electricity_kWh"].shift(1)
    )

    df["Electricity_Lag2"] = (
        df["Electricity_kWh"].shift(2)
    )

    df["Electricity_Lag3"] = (
        df["Electricity_kWh"].shift(3)
    )

    df["Electricity_Lag12"] = (
        df["Electricity_kWh"].shift(12)
    )

    df["Month"] = df["Date"].dt.month

    return df


def predict_next_month(
    future_temperature_c=None,
    future_solar_kwh_m2_day=None,
):
    df = load_energy_data()

    df = prepare_features(df)

    latest = df.iloc[-1]

    next_month_date = (
        latest["Date"]
        + pd.DateOffset(months=1)
    )

    next_month = int(
        next_month_date.month
    )

    # Get environmental forecast automatically
    # when values are not manually provided.
    if (
        future_temperature_c is None
        or future_solar_kwh_m2_day is None
    ):
        environmental = (
            get_monthly_environmental_input()
        )

        if future_temperature_c is None:
            future_temperature_c = (
                environmental["temperature_c"]
            )

        if future_solar_kwh_m2_day is None:
            future_solar_kwh_m2_day = (
                environmental[
                    "solar_kwh_m2_day"
                ]
            )

    features = pd.DataFrame(
        [[
            latest["Electricity_Lag1"],
            latest["Electricity_Lag2"],
            latest["Electricity_Lag3"],
            latest["Electricity_Lag12"],
            future_temperature_c,
            future_solar_kwh_m2_day,
            next_month,
        ]],
        columns=FEATURE_NAMES,
    )

    prediction = model.predict(features)[0]

    return {
        "forecast_kwh": float(prediction),

        "forecast_month": next_month,

        "forecast_date": (
            next_month_date.strftime(
                "%Y-%m-%d"
            )
        ),

        "input_date": (
            latest["Date"].strftime(
                "%Y-%m-%d"
            )
        ),

        "temperature_c": float(
            future_temperature_c
        ),

        "solar_kwh_m2_day": float(
            future_solar_kwh_m2_day
        ),

        "environment_source": "Open-Meteo",
    }