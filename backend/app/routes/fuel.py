from fastapi import APIRouter

from app.services.fuel_service import get_fuel_status


router = APIRouter()


@router.get("/stations/{station_id}/fuel")
def get_station_fuel(station_id: str):

    result = get_fuel_status()

    return {
        "stationId": station_id,
        **result,
        "meta": {
            "source": "AADC",
            "stationId": station_id
        }
    }