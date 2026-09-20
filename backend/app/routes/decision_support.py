from fastapi import APIRouter
from app.services.decision_support_service import evaluate_decision_support

router = APIRouter()


@router.get("/stations/{station_id}/resilience/decision-support")
def get_decision_support(station_id: str):
    return evaluate_decision_support(station_id=station_id)
