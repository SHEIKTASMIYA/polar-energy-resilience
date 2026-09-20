from pathlib import Path

import joblib
import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error


BASE_DIR = Path(__file__).resolve().parent

DATA_PATH = (
    BASE_DIR
    / "data"
    / "mawson_energy_master_2001_2016.csv"
)

MODEL_PATH = (
    BASE_DIR
    / "ml"
    / "demand_forecaster.pkl"
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


def load_data():
    df = pd.read_csv(DATA_PATH)

    df["Date"] = pd.to_datetime(df["Date"])

    df = (
        df
        .sort_values("Date")
        .reset_index(drop=True)
    )

    return df


def create_training_data(df):
    df = df.copy()

    # Historical electricity demand features
    df["Electricity_Lag1"] = df["Electricity_kWh"].shift(1)
    df["Electricity_Lag2"] = df["Electricity_kWh"].shift(2)
    df["Electricity_Lag3"] = df["Electricity_kWh"].shift(3)
    df["Electricity_Lag12"] = df["Electricity_kWh"].shift(12)

    # The model will use the NEXT month's
    # environmental conditions to predict
    # the NEXT month's electricity demand.
    df["Future_Temperature_C"] = df["Temperature_C"].shift(-1)
    df["Future_Solar_kWh_m2_day"] = df["Solar_kWh_m2_day"].shift(-1)
    df["Future_Month"] = df["Date"].shift(-1).dt.month

    # Target = next month's electricity demand
    df["Target_Electricity_kWh"] = df["Electricity_kWh"].shift(-1)

    df = df.dropna().reset_index(drop=True)

    X = df[
        [
            "Electricity_Lag1",
            "Electricity_Lag2",
            "Electricity_Lag3",
            "Electricity_Lag12",
            "Future_Temperature_C",
            "Future_Solar_kWh_m2_day",
            "Future_Month",
        ]
    ].copy()

    X.columns = FEATURE_NAMES

    y = df["Target_Electricity_kWh"]

    return X, y, df


def main():
    print("========================================")
    print(" POLAR ENERGY RESILIENCE")
    print(" Demand Forecast Model Training")
    print("========================================")

    df = load_data()

    print(f"\nLoaded rows: {len(df)}")
    print(
        f"Date range: "
        f"{df['Date'].min().date()} → "
        f"{df['Date'].max().date()}"
    )

    X, y, prepared = create_training_data(df)

    print(f"Training rows after feature preparation: {len(X)}")

    # Chronological split.
    # We deliberately do NOT randomly shuffle time-series data.
    split_index = int(len(X) * 0.8)

    X_train = X.iloc[:split_index]
    X_test = X.iloc[split_index:]

    y_train = y.iloc[:split_index]
    y_test = y.iloc[split_index:]

    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples: {len(X_test)}")

    model = RandomForestRegressor(
        n_estimators=300,
        random_state=42,
        max_depth=None,
        min_samples_leaf=2,
        n_jobs=-1,
    )

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    rmse = mean_squared_error(
        y_test,
        predictions
    ) ** 0.5

    print("\n========================================")
    print(" MODEL EVALUATION")
    print("========================================")
    print(f"MAE :  {mae:,.2f} kWh")
    print(f"RMSE:  {rmse:,.2f} kWh")

    print("\nFeature importance:")

    for name, importance in zip(
        FEATURE_NAMES,
        model.feature_importances_,
    ):
        print(
            f"  {name}: "
            f"{importance:.4f}"
        )

    joblib.dump(model, MODEL_PATH)

    print("\n========================================")
    print(" MODEL SAVED")
    print("========================================")
    print(MODEL_PATH)
    print("\nTarget:")
    print("Next month's electricity demand")

    print("\nFeatures:")
    for feature in FEATURE_NAMES:
        print(f"  - {feature}")

    print("\nTraining complete.")


if __name__ == "__main__":
    main()