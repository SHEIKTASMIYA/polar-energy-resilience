# Polar Energy Resilience — Antarctic Microgrid Decision Support Platform

An AI-driven energy resilience and decision-support platform engineered for isolated Antarctic research stations, with **Mawson Station, Australia (67°36'S 62°52'E)** as the reference station.

---

## 1. Problem Statement

Antarctic research stations operate under extreme polar conditions where power generation, heating, solar variation, katabatic winds, and annual fuel resupply logistics directly dictate human survival and scientific continuity. 

When compounding disruption events occur — such as severe katabatic blizzards, sub-zero temperature drops, diesel generator unit outages, or ice-lockup delays of annual resupply vessels (e.g., RSV *Nuyina*) — station station commanders need rapid, quantitative decision support to allocate microgrid energy and prevent catastrophic fuel depletion.

---

## 2. Platform Solution & Core Features

- **Live Station Overview**: Mission-control status dashboard displaying active electrical load, power flow stack, environmental conditions, alert feeds, and AI decision support.
- **Electricity Demand Forecasting**: Random Forest model predicting next-period station electrical demand from historical consumption and Open-Meteo climate inputs.
- **Solar & Resource Intelligence**: NASA POWER (GHI/DNI irradiance) and MERRA-2 ambient temperature integration for 85 kWp bifacial PV yield estimation.
- **Microgrid Energy Optimizer**: Constrained optimization solver evaluating power balance across Solar PV, LiFePO4 Battery Storage, and Caterpillar Diesel Generators (`Cost-Min`, `Fuel-Min`, `Reliability-Max`).
- **Fuel Intelligence & Resupply**: Special Antarctic Blend (SAB) fuel reserve tracking, daily burn rate estimation, and 60-day survival drawdown curves.
- **Contingency Scenario Simulator**: Multi-perturbation stress-test engine modeling blizzards, temperature drops, genset failures, solar loss, and resupply vessel delays.
- **Extreme-Weather Scenario Compare**: Side-by-side marginal impact and delta comparison between compounding failure modes.
- **Station & Asset Registry**: Operational registry of generator units, battery storage banks, solar array fields, and health/reliability indices.
- **Operator Decision Support Engine**: Rule-based AI advisory engine evaluating system telemetry and generating prioritized, calculated recommendations.

---

## 3. Architecture Overview

```
[ AADC Datasets ] → [ Historical Data (2001-2016) ] ──┐
                                                      ├──> [ Random Forest Model ] ──┐
[ Open-Meteo API ] → [ Live Solar & Temp Inputs ] ────┘                              │
                                                                                     ▼
                                                                        [ FastAPI Backend API ]
                                                                                     │
[ Constrained Energy Optimizer ] <────────────────────────────────────────────────────┤
[ Fuel Survival Horizon Engine ] <───────────────────────────────────────────────────┤
[ Contingency Scenario Simulator ] <──────────────────────────────────────────────────┤
[ Operator Decision Support AI ] <───────────────────────────────────────────────────┘
                                                                                     │
                                                                                     ▼
                                                                        [ React Mission Control UI ]
```

---

## 4. Machine Learning & Model Evaluation

- **Model**: `RandomForestRegressor` (`backend/ml/demand_forecaster.pkl`).
- **Input Features**:
  1. `Electricity_Lag1`: Prior month electricity consumption (kWh)
  2. `Electricity_Lag2`: 2-month lagged consumption (kWh)
  3. `Electricity_Lag3`: 3-month lagged consumption (kWh)
  4. `Electricity_Lag12`: 12-month seasonal lagged consumption (kWh)
  5. `Temperature_C`: Ambient air temperature (°C)
  6. `Solar_kWh_m2_day`: Daily solar irradiance (kWh/m²/day)
  7. `Month`: Seasonal calendar month (1–12)
- **Validation Metrics** (Evaluated on 20% chronological holdout of Mawson historical master dataset):
  - **MAE**: 16,218.45 kWh (~4.2% mean error)
  - **RMSE**: 20,840.68 kWh

---

## 5. Microgrid Energy Optimizer Methodology

The optimization engine (`energy_optimizer_service.py`) calculates hourly microgrid energy dispatch over a 24-hour planning horizon:

$$\min \sum_{t=1}^{24} \left( \text{Fuel}_t \cdot w_{\text{fuel}} + \text{UnservedLoad}_t \cdot 1000 + \text{BatteryViolation}_t \cdot 20 \right)$$

Subject to:
1. $\text{SolarUsed}_t \le \text{SolarAvailable}_t$
2. $\text{BatteryDischarge}_t \le \min(P_{\text{max,dis}}, \text{StoredEnergy}_t - \text{MinSoC})$
3. $\text{BatteryCharge}_t \le \min(P_{\text{max,chg}}, \text{MaxSoC} - \text{StoredEnergy}_t, \text{ExcessSolar}_t)$
4. $\text{GensetOutput}_t \le \sum_{g \in \text{Online}} P_{g,\text{rated}}$
5. $\text{SolarUsed}_t + \text{BatteryDischarge}_t + \text{GensetOutput}_t + \text{UnservedLoad}_t = \text{Load}_t$

---

## 6. Data Provenance & Honesty Rules

Public live telemetry for Mawson Station SCADA, battery cells, and fuel tanks is unavailable. To enforce strict data honesty:
- All derived, simulated, and historical values are transparently tagged in API payloads and UI tags with:
  - `AADC`: Historical station master datasets (2001–2016).
  - `NASA_POWER`: Satellite solar irradiance observations.
  - `MERRA2`: NASA atmospheric reanalysis temperature data.
  - `DERIVED`: Computed microgrid optimization, yield, or fuel survival models.
  - `SIMULATED`: Contingency scenario simulator outputs.

---

## 7. API Reference

- `GET /api/v1/stations/{id}/overview`: Station status metrics, power flow, and 24h load curve.
- `GET /api/v1/stations/{id}/forecast/demand`: Random Forest demand forecast & feature drivers.
- `GET /api/v1/stations/{id}/resource/solar`: Hourly GHI/DNI solar irradiance and ambient temp series.
- `GET /api/v1/stations/{id}/dispatch?strategy=cost_min`: Microgrid energy optimizer dispatch plan.
- `GET /api/v1/stations/{id}/fuel`: SAB fuel reserve tracking, burn rate, and 60-day survival curve.
- `GET /api/v1/stations/{id}/assets`: Station generator, battery, and solar asset registry.
- `GET /api/v1/stations/{id}/resilience/decision-support`: Operator decision-support status & guidance.
- `POST /api/v1/scenarios/run`: Execute multi-perturbation contingency scenario simulation.

---

## 8. Local Setup & Execution

### Prerequisites
- Python 3.10+
- Node.js 18+

### Start Backend (FastAPI)
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```

### Start Frontend (React / Vite)
```powershell
cd frontend-scaffold
npm install
npm run dev -- --port 5174
```

---

## 9. Production & AWS Deployment Readiness

- **Decoupled API Seam**: `src/services/endpoints.ts` communicates via configurable `VITE_API_BASE_URL`.
- **CORS Configuration**: Backend middleware configured for development and production origins.
- **Production Build**: Verified with zero TypeScript compilation errors (`npm run build`).

---

## Team

**TechTide** — Hackathon Submission