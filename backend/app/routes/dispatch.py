from datetime import datetime, timezone, timedelta
from fastapi import APIRouter
from app.services.demand_forecast_service import predict_next_month
from app.services.weather_service import get_hourly_environmental_forecast
from app.services.energy_optimizer_service import optimize_energy_dispatch

router = APIRouter()


@router.get("/stations/{station_id}/dispatch")
def get_dispatch_plan(station_id: str, strategy: str = "cost_min"):
    # 1. Base demand load profile (24 hours)
    try:
        forecast = predict_next_month()
        base_kw = forecast["forecast_kwh"] / (30 * 24)
    except Exception:
        base_kw = 224.5

    load_profile = [
        round(base_kw + 15.0 * (1.0 if 8 <= h <= 20 else -0.8), 1)
        for h in range(24)
    ]

    # 2. Solar availability profile (24 hours horizon aligned with Open-Meteo forecast)
    now = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0)
    solar_profile = []

    try:
        hourly_forecast = get_hourly_environmental_forecast()
        timestamps = hourly_forecast.get("timestamps", [])
        solar_radiation = hourly_forecast.get("solar_radiation_w_m2", [])

        rad_map = {}
        for ts, rad in zip(timestamps, solar_radiation):
            key = str(ts).replace("Z", "").split("+")[0][:13]
            rad_map[key] = float(rad) if rad is not None else 0.0

        solar_array_capacity_kwp = 85.0  # Station Solar Array Field 1 capacity (kWp)

        for i in range(24):
            dt = now + timedelta(hours=i)
            dt_key = dt.strftime("%Y-%m-%dT%H")
            rad = rad_map.get(dt_key, 0.0)
            solar_kw = round(max(0.0, solar_array_capacity_kwp * (rad / 1000.0)), 1)
            solar_profile.append(solar_kw)
    except Exception:
        solar_profile = [0.0] * 24

    # 3. Invoke Microgrid Energy Optimizer Engine
    result = optimize_energy_dispatch(
        load_profile=load_profile,
        solar_profile=solar_profile,
        strategy=strategy,
        initial_soc=68.0,
        battery_capacity_kwh=250.0,
        fuel_reserve_l=50000.0,
    )

    return result

