from app.services.demand_forecast_service import (
    predict_next_month,
)


print("\n===== MAWSON DEMAND FORECAST =====")

result = predict_next_month()

print(
    "Input date:",
    result["input_date"]
)

print(
    "Forecast date:",
    result["forecast_date"]
)

print(
    "Forecast temperature:",
    result["temperature_c"],
    "°C"
)

print(
    "Forecast solar:",
    result["solar_kwh_m2_day"],
    "kWh/m²/day"
)

print(
    "Forecast demand:",
    result["forecast_kwh"],
    "kWh"
)

print(
    "Environmental source:",
    result["environment_source"]
)

print("==================================")