from app.services.weather_service import (
    get_current_weather,
    get_weather_forecast,
    get_monthly_environmental_input,
)


print("\n===== MAWSON CURRENT WEATHER =====")

current = get_current_weather()

print("Temperature:", current["temperature_c"], "°C")
print("Wind:", current["wind_speed_kmh"], "km/h")
print(
    "Solar radiation:",
    current["solar_radiation_w_m2"],
    "W/m²"
)
print("Time:", current["timestamp"])
print("Source:", current["source"])


print("\n===== MAWSON FORECAST =====")

forecast = get_weather_forecast()

print("Forecast days:", len(forecast["dates"]))
print("First date:", forecast["dates"][0])
print("Last date:", forecast["dates"][-1])
print("Source:", forecast["source"])


print("\n===== ML ENVIRONMENTAL INPUT =====")

monthly = get_monthly_environmental_input()

print(
    "Forecast temperature:",
    monthly["temperature_c"],
    "°C"
)

print(
    "Forecast solar:",
    monthly["solar_kwh_m2_day"],
    "kWh/m²/day"
)

print(
    "Forecast period:",
    monthly["forecast_start"],
    "→",
    monthly["forecast_end"]
)

print("Source:", monthly["source"])

print("==================================")