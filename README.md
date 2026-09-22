# 🚀 Polar Energy Resilience — Antarctic Energy Decision Support Platform

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue)](https://www.python.org/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)](https://fastapi.tiangolo.com/)
[![Scikit--learn](https://img.shields.io/badge/ML-Scikit--learn-F7931E)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**A mission-control style platform for forecasting energy demand, monitoring fuel resilience, planning microgrid dispatch, and testing extreme-weather scenarios for isolated Antarctic research stations.**

Polar Energy Resilience is a decision-support platform built around the challenges faced by remote Antarctic research stations, where electricity generation, fuel availability, renewable resources, and extreme weather can directly affect operational continuity.

Using historical Mawson Station energy data, weather and solar inputs, machine learning, energy dispatch planning, fuel analysis, and contingency simulation, the platform helps operators explore **what may happen to the station's energy system under different operating conditions and disruptions**.

The project uses **Mawson Station, Antarctica** as the reference station.

---

## 📌 Table of Contents

- [✨ Features](#-features)
- [🎯 Problem](#-problem)
- [💡 Our Approach](#-our-approach)
- [📊 Machine Learning](#-machine-learning)
- [⚡ Energy Dispatch Optimizer](#-energy-dispatch-optimizer)
- [⛽ Fuel Intelligence](#-fuel-intelligence)
- [🌨️ Scenario Simulator](#️-scenario-simulator)
- [☀️ Weather and Solar Intelligence](#️-weather-and-solar-intelligence)
- [🧠 Decision Support](#-decision-support)
- [🏗️ System Architecture](#️-system-architecture)
- [📁 Repository Structure](#-repository-structure)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📡 API](#-api)
- [📈 Model Evaluation](#-model-evaluation)
- [🔍 Data Transparency](#-data-transparency)
- [⚠️ Limitations](#️-limitations)
- [🔮 Future Improvements](#-future-improvements)
- [🧪 Model Training](#-model-training)
- [🤝 Team](#-team)
- [📜 License](#-license)

---

## ✨ Features

- **🔮 Electricity Demand Forecasting:** Random Forest model for estimating the next month's station electricity demand.
- **⛽ Fuel Intelligence:** Estimates fuel burn rate, remaining fuel, fuel availability, and a 60-day planning projection.
- **⚡ Energy Dispatch Planning:** Plans how solar, battery storage, and generators can contribute to meeting station demand.
- **🌨️ Extreme-Weather Scenarios:** Simulates blizzards, temperature drops, solar losses, generator outages, and resupply delays.
- **📊 Scenario Analysis:** Supports multiple simultaneous events with configurable start days, durations, and magnitudes.
- **☀️ Weather & Solar Data:** Uses Open-Meteo environmental and solar inputs for the Mawson reference location.
- **🧠 Operator Decision Support:** Converts system conditions and planning results into operational guidance.
- **🏭 Asset Registry:** Provides a structured view of station generators, battery storage, and solar resources.
- **🖥️ Mission-Control UI:** React-based interface designed around energy operations rather than a generic analytics dashboard.
- **🔎 Transparent Data Labels:** Separates historical, external, derived, and simulated information.

---

## 🎯 Problem

Antarctic research stations operate in one of the world's most isolated and demanding environments.

Unlike a conventional power system, an isolated station cannot simply depend on a nearby grid when something goes wrong. Fuel availability, weather conditions, renewable generation, battery storage, and generator availability all become important operational factors.

A station operator may need to answer questions such as:

- How much electricity could the station require next month?
- How long could the current fuel reserve support operations?
- What happens if a severe blizzard occurs?
- What happens if temperatures suddenly decrease?
- What happens if solar availability is reduced?
- What happens if a generator becomes unavailable?
- How does a combination of multiple disruptions affect the station?
- How should available energy resources be dispatched?

Polar Energy Resilience brings these questions into one decision-support platform.

---

## 💡 Our Approach

The platform combines historical data, machine learning, environmental inputs, fuel analysis, energy planning, and scenario simulation.

```text
Historical Mawson Data
        │
        ▼
Data Preparation
        │
        ├──────────────► Random Forest Demand Forecast
        │
        ├──────────────► Fuel Analysis
        │
        └──────────────► Historical Energy Analysis
                                │
Open-Meteo ─────────────────────┤
                                ▼
                         FastAPI Backend
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
         Fuel Engine      Dispatch Engine    Scenario Engine
              │                 │                 │
              └─────────────────┼─────────────────┘
                                ▼
                       Decision Support
                                │
                                ▼
                       React Mission Control
```

The goal is not autonomous control.

The platform is designed to help an operator understand the planning situation, explore possible disruptions, and evaluate different energy-management strategies.

---

## 📊 Machine Learning

The project uses a `RandomForestRegressor` to estimate the next month's electricity demand.

### Model inputs

| Feature | Description |
|---|---|
| `Electricity_Lag1` | Previous month's electricity consumption |
| `Electricity_Lag2` | Electricity consumption from two months earlier |
| `Electricity_Lag3` | Electricity consumption from three months earlier |
| `Electricity_Lag12` | Electricity consumption from twelve months earlier |
| `Temperature_C` | Temperature input |
| `Solar_kWh_m2_day` | Solar radiation input |
| `Month` | Calendar month |

The reproducible training pipeline is located at:

```text
backend/train_demand_model.py
```

The trained model is stored at:

```text
backend/ml/demand_forecaster.pkl
```

The training process uses a chronological split so that earlier observations are used for training and later observations are used for evaluation.

---

## 📈 Model Evaluation

The current model was evaluated on a chronological 20% holdout of the prepared historical dataset.

| Metric | Result |
|---|---:|
| MAE | 16,218.45 kWh |
| RMSE | 20,840.68 kWh |

The available historical dataset is relatively small, so these results should be considered an evaluation of the current prototype rather than a production accuracy guarantee.

A production forecasting system would require more historical observations, higher-frequency operational data, and additional validation.

---

## ⚡ Energy Dispatch Optimizer

The platform includes a 24-hour energy dispatch planning engine.

The optimizer considers:

- Station electricity demand
- Available solar energy
- Battery state of charge
- Battery charge limits
- Battery discharge limits
- Generator capacity
- Fuel consumption
- Minimum battery reserve

Three planning strategies are available:

```text
Cost-Min
Fuel-Min
Reliability-Max
```

The optimizer checks the energy balance:

```text
Solar Used
+ Battery Discharge
+ Generator Output
+ Unserved Load
= Station Load
```

The API reports whether the planned dispatch maintains the required power balance and whether unserved energy occurs.

The optimizer is intended for planning and analysis and is not a replacement for a physical microgrid controller.

---

## ⛽ Fuel Intelligence

Fuel is one of the most important resources for an isolated Antarctic station.

The fuel module provides:

- Historical fuel consumption
- Average daily fuel burn
- Estimated remaining fuel
- Estimated days of fuel availability
- Burn-rate sensitivity
- 60-day fuel projection
- Fuel risk status

The current implementation uses historical Mawson fuel-consumption data together with a documented planning reserve assumption.

It does not claim to have access to live fuel-tank telemetry from Mawson Station.

---

## 🌨️ Scenario Simulator

The contingency simulator allows operators to test how the energy system behaves under possible disruptions.

Supported perturbations include:

- **Blizzard**
- **Temperature Drop**
- **Generator Outage**
- **Solar Loss**
- **Resupply Delay**

Each event can be configured with:

- Magnitude
- Start day
- Duration

Multiple events can also be combined.

For example:

```text
Day 2
│
├── Temperature Drop
│
└── Blizzard
     │
     └── Continues for 3 days
```

The simulator tracks changes in:

- Electricity demand
- Battery state of charge
- Fuel consumption
- Remaining fuel
- System severity

Perturbations are applied only during their configured event windows.

Scenario results are simulated planning outputs and are clearly separated from historical and external data.

---

## ☀️ Weather and Solar Intelligence

The platform uses Open-Meteo for environmental inputs for the Mawson reference location.

The current implementation uses information including:

- Temperature
- Shortwave solar radiation
- Weather conditions

The application uses Open-Meteo shortwave radiation directly as an environmental input.

It does **not** claim that shortwave radiation is directly measured GHI or DNI, and it does not infer installed PV capacity or actual station PV generation from the radiation value unless explicitly modeled.

This keeps the platform aligned with the data that is actually available.

---

## 🧠 Decision Support

The platform includes a decision-support layer that brings together information from the different energy modules.

It considers factors such as:

- Electricity demand
- Fuel availability
- Battery state
- Solar conditions
- Generator availability
- Scenario results
- System severity

The purpose is to help an operator identify conditions that require attention and understand the reasoning behind the recommendation.

The system provides decision support rather than automatically controlling the station.

---

## 🏭 Station Asset Registry

The platform includes an asset registry for organizing the station's major energy resources.

The registry can represent:

- Generator units
- Battery storage
- Solar resources
- Asset status
- Operational information
- Reliability information

This provides a structured view of the infrastructure being considered by the decision-support system.

---

## 🏗️ System Architecture

```text
                         ┌─────────────────────────┐
                         │   Mawson Historical     │
                         │       Data 2001–2016    │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │    Data Preparation     │
                         └────────────┬────────────┘
                                      │
                     ┌────────────────┴────────────────┐
                     │                                 │
                     ▼                                 ▼
          ┌────────────────────┐             ┌──────────────────┐
          │ Random Forest      │             │ Historical Fuel  │
          │ Demand Forecast    │             │ Analysis         │
          └──────────┬─────────┘             └────────┬─────────┘
                     │                                │
                     └────────────────┬───────────────┘
                                      │
                 ┌────────────────────▼────────────────────┐
                 │              FastAPI Backend             │
                 │                                         │
                 │ Forecast │ Fuel │ Solar │ Dispatch      │
                 │ Scenario │ Assets │ Decision Support   │
                 └────────────────────┬────────────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │   React Mission        │
                         │   Control Interface    │
                         └─────────────────────────┘
```

---

## 📁 Repository Structure

```text
polar-energy-resilience/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │
│   │   ├── routes/
│   │   │   ├── assets.py
│   │   │   ├── decision_support.py
│   │   │   ├── demand_forecast.py
│   │   │   ├── dispatch.py
│   │   │   ├── fuel.py
│   │   │   ├── overview.py
│   │   │   ├── scenario.py
│   │   │   └── solar.py
│   │   │
│   │   └── services/
│   │       ├── decision_support_service.py
│   │       ├── demand_forecast_service.py
│   │       ├── energy_optimizer_service.py
│   │       ├── fuel_service.py
│   │       └── weather_service.py
│   │
│   ├── data/
│   ├── ml/
│   ├── main.py
│   ├── train_demand_model.py
│   ├── test_model.py
│   ├── test_real_forecast.py
│   ├── test_weather.py
│   ├── test_fuel.py
│   └── requirements.txt
│
├── frontend-scaffold/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── config/
│   │   ├── features/
│   │   ├── mocks/
│   │   ├── services/
│   │   ├── state/
│   │   ├── styles/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── docs/
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🛠️ Tech Stack

### Frontend

- **React**
- **TypeScript**
- **Vite**
- **CSS**

### Backend

- **Python**
- **FastAPI**
- **Pydantic**
- **Pandas**
- **NumPy**

### Machine Learning

- **Scikit-learn**
- **Random Forest Regression**
- **Joblib**

### Data

- **Historical Mawson Station datasets**
- **Open-Meteo API**
- **CSV-based energy datasets**

### Development

- **Git**
- **GitHub**
- **VS Code**

---

## 🚀 Getting Started

Follow the steps below to run Polar Energy Resilience locally.

### Prerequisites

Make sure you have:

- Python 3.10 or newer
- Node.js 18 or newer
- npm
- Git

### Backend Installation

Open PowerShell in the project directory:

```powershell
cd backend
```

Activate the Python virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

Start the FastAPI server:

```powershell
uvicorn main:app --reload --port 8000
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend Installation

Open another terminal:

```powershell
cd frontend-scaffold
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev -- --port 5174
```

The frontend will be available at:

```text
http://localhost:5174
```

---

## 💡 Usage

Once both the backend and frontend are running:

1. Open the frontend in your browser.
2. Navigate through the Mission Control dashboard.
3. Review the station energy overview.
4. Open the demand forecast to view the model prediction and drivers.
5. Review fuel availability and the 60-day projection.
6. Open the solar/weather section to inspect environmental inputs.
7. Use the Energy Dispatch section to compare dispatch strategies.
8. Open the Scenario Simulator.
9. Configure one or more disruptions.
10. Run the scenario and inspect the resulting energy, battery, and fuel timeline.

The backend API can also be tested directly through the FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 📡 API

The main API endpoints are:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/stations/{id}/overview` | Station overview and energy information |
| `GET` | `/api/v1/stations/{id}/forecast/demand` | Electricity demand forecast |
| `GET` | `/api/v1/stations/{id}/resource/solar` | Solar and weather resource data |
| `GET` | `/api/v1/stations/{id}/dispatch` | 24-hour energy dispatch plan |
| `GET` | `/api/v1/stations/{id}/fuel` | Fuel status and projection |
| `GET` | `/api/v1/stations/{id}/assets` | Station asset information |
| `GET` | `/api/v1/stations/{id}/resilience/decision-support` | Decision-support information |
| `POST` | `/api/v1/scenarios/run` | Run a contingency scenario |

Example dispatch request:

```text
GET /api/v1/stations/mawson/dispatch?strategy=cost_min
```

---

## 🔍 Data Transparency

The project deliberately separates different types of information.

### Historical

Data originating from the available Mawson historical datasets.

### External

Environmental information obtained from Open-Meteo.

### Derived

Values calculated by the application, including:

- Demand forecasts
- Fuel projections
- Dispatch plans
- Battery projections
- Decision-support calculations

### Simulated

Outputs produced by the contingency scenario engine.

This distinction prevents simulated or calculated values from being presented as live station measurements.

---

## ⚠️ Limitations

This project is currently a prototype and decision-support platform.

The current system does not have access to:

- Live Mawson SCADA telemetry
- Live fuel-tank measurements
- Live battery-cell telemetry
- Live generator controller data
- Detailed generator efficiency curves
- Detailed battery degradation characteristics
- Actual station PV generation telemetry
- Real-time resupply vessel schedules

The historical dataset available for this prototype is also relatively small.

Therefore, the system should be treated as a planning and demonstration platform rather than an autonomous or safety-critical control system.

---

## 🔮 Future Improvements

Future versions could include:

### Live Telemetry

Integrate real-time:

- Station power measurements
- Generator status
- Battery state
- Fuel tank levels
- Renewable generation

### Improved Forecasting

- Larger historical datasets
- Higher-frequency energy measurements
- More weather features
- Time-series forecasting models
- Probabilistic forecasts

### Detailed Microgrid Modeling

- Generator efficiency curves
- Generator start-up constraints
- Battery degradation
- Battery health estimation
- Detailed solar generation modeling
- Multi-generator optimization

### Advanced Resilience Analysis

- Automatic worst-case scenario generation
- Scenario comparison
- Monte Carlo simulation
- Resilience scoring
- Recovery-time estimation
- Automated alerts

### Cloud Deployment

The current architecture keeps the frontend and backend separated, making it possible to deploy the system as independent services and add cloud-based data ingestion in future versions.

---

## 🧪 Model Training

The demand forecasting model can be retrained using:

```powershell
cd backend
python train_demand_model.py
```

The script:

1. Loads the historical energy dataset.
2. Sorts the observations chronologically.
3. Creates lag features.
4. Adds environmental and seasonal features.
5. Creates a chronological train/test split.
6. Trains the Random Forest model.
7. Evaluates the model.
8. Saves the trained model.

The resulting model is saved to:

```text
backend/ml/demand_forecaster.pkl
```

---

## 🤝 Team

### Team TechTide

Built for the **WeMakeDevs × AWS First Commit — Bharat Builds Tour**.

We built Polar Energy Resilience to explore how machine learning, energy planning, and software engineering can be combined to support resilient operations in one of the world's most isolated environments.

---

## 📜 License

Distributed under the **MIT License**.

See the `LICENSE` file for more information.

---

## ⚠️ Disclaimer

Polar Energy Resilience is a prototype developed for hackathon, research, and demonstration purposes.

The forecasts, simulations, optimization results, and recommendations produced by the platform should not be used as the sole basis for real-world safety, energy-management, or operational decisions.