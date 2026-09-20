from app.services.demand_forecast_service import predict_demand


prediction = predict_demand(
    electricity_lag1=220.0,
    electricity_lag2=215.0,
    electricity_lag3=210.0,
    electricity_lag12=200.0,
    temperature_c=-20.0,
    solar_kwh_m2_day=0.2,
    month=7,
)

print("Predicted demand:", prediction, "kWh")