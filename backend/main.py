from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.overview import router as overview_router
from app.routes.demand_forecast import router as demand_forecast_router
from app.routes.fuel import router as fuel_router
from app.routes.scenario import router as scenario_router
from app.routes.solar import router as solar_router
from app.routes.dispatch import router as dispatch_router
from app.routes.assets import router as assets_router
from app.routes.decision_support import router as decision_support_router

app = FastAPI(
    title="Polar Energy Resilience API",
    description="Backend API for Antarctic research station energy management",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    overview_router,
    prefix="/api/v1"
)

app.include_router(
    demand_forecast_router,
    prefix="/api/v1"
)

app.include_router(
    fuel_router,
    prefix="/api/v1"
)

app.include_router(
    scenario_router,
    prefix="/api/v1"
)

app.include_router(
    solar_router,
    prefix="/api/v1"
)

app.include_router(
    dispatch_router,
    prefix="/api/v1"
)

app.include_router(
    assets_router,
    prefix="/api/v1"
)

app.include_router(
    decision_support_router,
    prefix="/api/v1"
)

@app.get("/")
def root():
    return {
        "message": "Polar Energy Resilience API is running"
    }