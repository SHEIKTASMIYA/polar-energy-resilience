from fastapi import APIRouter

from app.services.demand_forecast_service import (
    predict_next_month,
    model,
)


router = APIRouter()


@router.get("/stations/{station_id}/forecast/demand")
def get_demand_forecast(
    station_id: str,
    horizon: str = "30d",
):
    result = predict_next_month()

    feature_importances = dict(
        zip(
            model.feature_names_in_,
            model.feature_importances_,
        )
    )

    forecast_kw = (
        result["forecast_kwh"]
        / (30 * 24)
    )

    return {
        "horizon": horizon,

        "modelVersion": (
            "demand-random-forest-v1"
        ),

        "forecast": {
            "date": result["forecast_date"],
            "energyKwh": result["forecast_kwh"],
            "averagePowerKw": forecast_kw,
        },

        "environment": {
            "temperatureC": result[
                "temperature_c"
            ],
            "solarKwhM2Day": result[
                "solar_kwh_m2_day"
            ],
            "source": result[
                "environment_source"
            ],
        },

        "drivers": [
            {
                "feature": feature,
                "importance": float(
                    importance
                ),
            }
            for feature, importance
            in feature_importances.items()
        ],

        "modelEvaluation": {
            "maeKwh": 16218.45,
            "rmseKwh": 20840.68,
            "evaluatedAgainst": (
                "chronological 20% holdout"
            ),
        },

        "meta": {
            "source": "DERIVED",
            "inputDate": result[
                "input_date"
            ],
            "stationId": station_id,
            "forecastType": (
                "next-month electricity "
                "demand estimate"
            ),
        },
    }