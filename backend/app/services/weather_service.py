import requests


MAWSON_LATITUDE = -67.6027
MAWSON_LONGITUDE = 62.8730

OPEN_METEO_URL = (
    "https://api.open-meteo.com/v1/forecast"
)


def get_current_weather():
    params = {
        "latitude": MAWSON_LATITUDE,
        "longitude": MAWSON_LONGITUDE,
        "current": (
            "temperature_2m,"
            "wind_speed_10m,"
            "shortwave_radiation"
        ),
        "timezone": "UTC",
    }

    response = requests.get(
        OPEN_METEO_URL,
        params=params,
        timeout=15,
    )

    response.raise_for_status()

    data = response.json()
    current = data["current"]

    return {
        "temperature_c": current["temperature_2m"],
        "wind_speed_kmh": current["wind_speed_10m"],
        "solar_radiation_w_m2": current[
            "shortwave_radiation"
        ],
        "timestamp": current["time"],
        "latitude": MAWSON_LATITUDE,
        "longitude": MAWSON_LONGITUDE,
        "source": "Open-Meteo",
    }


def get_weather_forecast():
    params = {
        "latitude": MAWSON_LATITUDE,
        "longitude": MAWSON_LONGITUDE,
        "daily": (
            "temperature_2m_mean,"
            "shortwave_radiation_sum,"
            "wind_speed_10m_max"
        ),
        "forecast_days": 16,
        "timezone": "UTC",
    }

    response = requests.get(
        OPEN_METEO_URL,
        params=params,
        timeout=15,
    )

    response.raise_for_status()

    data = response.json()
    daily = data["daily"]

    return {
        "dates": daily["time"],
        "temperature_c": daily[
            "temperature_2m_mean"
        ],
        "solar_radiation_mj_m2": daily[
            "shortwave_radiation_sum"
        ],
        "max_wind_speed_kmh": daily[
            "wind_speed_10m_max"
        ],
        "source": "Open-Meteo",
    }


def get_hourly_environmental_forecast():
    """
    Return real hourly environmental forecast data
    for Mawson Station from Open-Meteo.
    """

    params = {
        "latitude": MAWSON_LATITUDE,
        "longitude": MAWSON_LONGITUDE,
        "hourly": (
            "temperature_2m,"
            "shortwave_radiation,"
            "wind_speed_10m"
        ),
        "forecast_days": 2,
        "timezone": "UTC",
    }

    response = requests.get(
        OPEN_METEO_URL,
        params=params,
        timeout=15,
    )

    response.raise_for_status()

    data = response.json()
    hourly = data["hourly"]

    return {
        "timestamps": hourly["time"],
        "temperature_c": hourly[
            "temperature_2m"
        ],
        "solar_radiation_w_m2": hourly[
            "shortwave_radiation"
        ],
        "wind_speed_kmh": hourly[
            "wind_speed_10m"
        ],
        "source": "Open-Meteo",
    }


def get_monthly_environmental_input():
    """
    Create an environmental input for the demand model
    using the available Open-Meteo forecast period.

    Note:
    This is NOT a true monthly forecast.
    It is the average over the available 16-day
    Open-Meteo forecast period.
    """

    params = {
        "latitude": MAWSON_LATITUDE,
        "longitude": MAWSON_LONGITUDE,
        "daily": (
            "temperature_2m_mean,"
            "shortwave_radiation_sum"
        ),
        "forecast_days": 16,
        "timezone": "UTC",
    }

    response = requests.get(
        OPEN_METEO_URL,
        params=params,
        timeout=15,
    )

    response.raise_for_status()

    data = response.json()
    daily = data["daily"]

    temperatures = [
        value
        for value in daily[
            "temperature_2m_mean"
        ]
        if value is not None
    ]

    solar_values = [
        value
        for value in daily[
            "shortwave_radiation_sum"
        ]
        if value is not None
    ]

    if not temperatures or not solar_values:
        raise ValueError(
            "No environmental forecast data returned."
        )

    average_temperature = (
        sum(temperatures)
        / len(temperatures)
    )

    average_solar_mj = (
        sum(solar_values)
        / len(solar_values)
    )

    average_solar_kwh = (
        average_solar_mj / 3.6
    )

    return {
        "temperature_c": float(
            average_temperature
        ),
        "solar_kwh_m2_day": float(
            average_solar_kwh
        ),
        "forecast_start": daily["time"][0],
        "forecast_end": daily["time"][-1],
        "source": "Open-Meteo",
        "forecast_period_days": len(
            daily["time"]
        ),
    }