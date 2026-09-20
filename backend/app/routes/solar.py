from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app.services.weather_service import (
    get_hourly_environmental_forecast,
)


router = APIRouter()


@router.get("/stations/{station_id}/resource/solar")
def get_solar_resource(station_id: str):
    """
    Return real hourly solar and environmental forecast data
    for the station location.

    Solar radiation is reported as Open-Meteo shortwave
    radiation. No GHI, DNI, installed PV capacity, or
    PV energy yield is inferred.
    """

    retrieved_at = datetime.now(
        timezone.utc
    ).isoformat()

    try:
        forecast = (
            get_hourly_environmental_forecast()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=(
                "Solar resource data is temporarily "
                "unavailable from Open-Meteo."
            ),
        ) from exc

    timestamps = forecast.get(
        "timestamps",
        [],
    )

    temperatures = forecast.get(
        "temperature_c",
        [],
    )

    solar_values = forecast.get(
        "solar_radiation_w_m2",
        [],
    )

    wind_values = forecast.get(
        "wind_speed_kmh",
        [],
    )

    points = []

    for index, timestamp in enumerate(
        timestamps
    ):
        solar = (
            solar_values[index]
            if index < len(solar_values)
            else None
        )

        temperature = (
            temperatures[index]
            if index < len(temperatures)
            else None
        )

        wind = (
            wind_values[index]
            if index < len(wind_values)
            else None
        )

        points.append(
            {
                "timestamp": timestamp,

                "shortwaveRadiationWm2": (
                    float(solar)
                    if solar is not None
                    else None
                ),

                "ambientTempC": (
                    float(temperature)
                    if temperature is not None
                    else None
                ),

                "windSpeedKmh": (
                    float(wind)
                    if wind is not None
                    else None
                ),
            }
        )

    if not points:
        raise HTTPException(
            status_code=503,
            detail=(
                "No hourly solar resource data "
                "was returned."
            ),
        )

    valid_solar_values = [
        point["shortwaveRadiationWm2"]
        for point in points
        if point["shortwaveRadiationWm2"]
        is not None
    ]

    average_solar = (
        sum(valid_solar_values)
        / len(valid_solar_values)
        if valid_solar_values
        else 0.0
    )

    maximum_solar = (
        max(valid_solar_values)
        if valid_solar_values
        else 0.0
    )

    return {
        "stationId": station_id,

        "points": points,

        "resourceSummary": {
            "forecastHours": len(points),
            "averageShortwaveRadiationWm2": round(
                average_solar,
                2,
            ),
            "peakShortwaveRadiationWm2": round(
                maximum_solar,
                2,
            ),
        },

        "meta": {
            "source": "Open-Meteo",
            "retrievedAt": retrieved_at,
            "stationId": station_id,
            "dataType": (
                "hourly environmental forecast"
            ),
            "solarVariable": (
                "shortwave radiation"
            ),
            "solarVariableUnit": "W/m²",
            "forecastHours": len(points),
            "note": (
                "Solar radiation is reported directly "
                "from Open-Meteo shortwave radiation. "
                "GHI, DNI, installed PV capacity, and "
                "PV energy yield are not inferred."
            ),
        },
    }