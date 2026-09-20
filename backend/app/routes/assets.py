from datetime import datetime, timezone
from fastapi import APIRouter

router = APIRouter()


@router.get("/stations/{station_id}/assets")
def get_station_assets(station_id: str):
    retrieved_at = datetime.now(timezone.utc).isoformat()
    
    assets = [
        {
            "id": "ast-gen-1",
            "name": "Diesel Genset #1",
            "category": "generator",
            "status": "NOMINAL",
            "capacity": "150 kW",
            "location": "Main Powerhouse Room 1",
            "lastMaintenance": "2026-08-14",
            "nextMaintenance": "2026-11-14",
            "healthPercent": 94,
            "specifications": {
                "Model": "Caterpillar 3512B",
                "Fuel Type": "Special Antarctic Blend (SAB)",
                "Fuel Efficiency": "0.28 L/kWh",
                "Total Runtime": "14,280 hours"
            }
        },
        {
            "id": "ast-gen-2",
            "name": "Diesel Genset #2",
            "category": "generator",
            "status": "NOMINAL",
            "capacity": "150 kW",
            "location": "Main Powerhouse Room 1",
            "lastMaintenance": "2026-07-28",
            "nextMaintenance": "2026-10-28",
            "healthPercent": 91,
            "specifications": {
                "Model": "Caterpillar 3512B",
                "Fuel Type": "Special Antarctic Blend (SAB)",
                "Fuel Efficiency": "0.29 L/kWh",
                "Total Runtime": "12,850 hours"
            }
        },
        {
            "id": "ast-gen-3",
            "name": "Diesel Genset #3",
            "category": "generator",
            "status": "WATCH",
            "capacity": "150 kW",
            "location": "Main Powerhouse Room 2",
            "lastMaintenance": "2026-05-10",
            "nextMaintenance": "2026-09-25",
            "healthPercent": 78,
            "specifications": {
                "Model": "Caterpillar 3512B",
                "Fuel Type": "Special Antarctic Blend (SAB)",
                "Fuel Efficiency": "0.31 L/kWh",
                "Total Runtime": "18,910 hours"
            }
        },
        {
            "id": "ast-gen-4",
            "name": "Emergency Genset #4",
            "category": "generator",
            "status": "NOMINAL",
            "capacity": "100 kW",
            "location": "Emergency Shelter B",
            "lastMaintenance": "2026-08-01",
            "nextMaintenance": "2026-12-01",
            "healthPercent": 98,
            "specifications": {
                "Model": "Cummins QSB7-G5",
                "Fuel Type": "SAB Diesel",
                "Fuel Efficiency": "0.34 L/kWh",
                "Total Runtime": "4,120 hours"
            }
        },
        {
            "id": "ast-bat-1",
            "name": "Main Battery Storage Bank A",
            "category": "battery",
            "status": "NOMINAL",
            "capacity": "1,200 kWh (LiFePO4)",
            "location": "Battery Building North",
            "lastMaintenance": "2026-06-15",
            "nextMaintenance": "2026-12-15",
            "healthPercent": 96,
            "specifications": {
                "Chemistry": "Lithium Iron Phosphate (LiFePO4)",
                "Max Discharge Rate": "400 kW",
                "Thermal Control": "Active Glycol Jacket (-10°C to +25°C)",
                "Total Cycles": "1,420 cycles"
            }
        },
        {
            "id": "ast-sol-1",
            "name": "Station Solar Array Field 1",
            "category": "solar",
            "status": "WATCH",
            "capacity": "85 kWp",
            "location": "Upper Ridge East",
            "lastMaintenance": "2026-04-12",
            "nextMaintenance": "2026-10-12",
            "healthPercent": 88,
            "specifications": {
                "Panels": "Bifacial Glass-Glass Monocrystalline",
                "Tilt": "65° Fixed Antarctic Tilt",
                "Inverters": "SMA Sunny Tripower CORE2",
                "Rime Ice Coating": "Hydrophobic Nanocoating"
            }
        }
    ]

    return {
        "assets": assets,
        "meta": {
            "source": "DERIVED",
            "retrievedAt": retrieved_at,
            "stationId": station_id
        }
    }
