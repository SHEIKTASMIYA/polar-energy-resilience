import { useState } from 'react';
import { useDemandForecast } from './hooks/useDemandForecast';
import { useStationContextStore } from '../../state/stationContextStore';
import { PageHeader } from '../../components/layout/PageHeader';
import { RangeSelector } from '../../components/controls/RangeSelector';
import { ForecastDriversPanel } from './components/ForecastDriversPanel';
import { LoadingSkeleton } from '../../components/feedback/LoadingSkeleton';

export function DemandForecastPage() {
  const { selectedStationId } = useStationContextStore();

  const [horizon, setHorizon] =
    useState<'24h' | '7d' | '30d'>('30d');

  const {
    data,
    isLoading,
    error,
  } = useDemandForecast(
    selectedStationId,
    horizon
  );

  if (isLoading || !data) {
    return (
      <div>
        <PageHeader
          title="Electricity Demand Forecast"
          subtitle="Loading Random Forest demand forecast..."
        />

        <LoadingSkeleton height={320} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Electricity Demand Forecast"
          subtitle="Unable to load the demand forecast"
        />

        <div className="panel">
          <div
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            {error.message}
          </div>
        </div>
      </div>
    );
  }

  const forecastKwh = data.forecast.energyKwh;
  const forecastKw = data.forecast.averagePowerKw;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      <PageHeader
        title="Electricity Demand Forecast"
        subtitle={`Next-month demand estimate using ${data.modelVersion}`}
        source="DERIVED"
        actions={
          <RangeSelector
            options={[
              {
                value: '30d',
                label: '30 Days',
              },
            ]}
            selected={horizon}
            onChange={(val) =>
              setHorizon(val)
            }
          />
        }
      />

      {/* Forecast Summary */}
      <div className="grid-12">

        {/* Average Power */}
        <div className="col-span-4 panel">
          <div className="panel-header">
            <span className="panel-title">
              Average Forecast Load
            </span>
          </div>

          <div
            className="mono"
            style={{
              fontSize: 'var(--fs-32)',
              fontWeight: 700,
              color: 'var(--accent-ice)',
            }}
          >
            {forecastKw.toFixed(2)} kW
          </div>

          <div
            style={{
              marginTop: 'var(--space-2)',
              fontSize: 'var(--fs-11)',
              color: 'var(--text-secondary)',
            }}
          >
            Average-power equivalent of the
            monthly energy forecast
          </div>
        </div>

        {/* Monthly Energy */}
        <div className="col-span-4 panel">
          <div className="panel-header">
            <span className="panel-title">
              Forecast Energy
            </span>
          </div>

          <div
            className="mono"
            style={{
              fontSize: 'var(--fs-32)',
              fontWeight: 700,
              color: 'var(--accent-ice)',
            }}
          >
            {Math.round(
              forecastKwh
            ).toLocaleString()} kWh
          </div>

          <div
            style={{
              marginTop: 'var(--space-2)',
              fontSize: 'var(--fs-11)',
              color: 'var(--text-secondary)',
            }}
          >
            Estimated electricity demand
          </div>
        </div>

        {/* Forecast Date */}
        <div className="col-span-4 panel">
          <div className="panel-header">
            <span className="panel-title">
              Forecast Period
            </span>
          </div>

          <div
            className="mono"
            style={{
              fontSize: 'var(--fs-18)',
              fontWeight: 700,
            }}
          >
            {data.forecast.date}
          </div>

          <div
            style={{
              marginTop: 'var(--space-2)',
              fontSize: 'var(--fs-11)',
              color: 'var(--text-secondary)',
            }}
          >
            Next forecast period in the
            historical model dataset
          </div>
        </div>
      </div>

      {/* Environmental Inputs */}
      <div className="grid-12">

        <div className="col-span-6 panel">
          <div className="panel-header">
            <span className="panel-title">
              Temperature Input
            </span>
          </div>

          <div
            className="mono"
            style={{
              fontSize: 'var(--fs-28)',
              fontWeight: 700,
            }}
          >
            {data.environment.temperatureC.toFixed(2)}
            {' °C'}
          </div>

          <div
            style={{
              marginTop: 'var(--space-2)',
              fontSize: 'var(--fs-11)',
              color: 'var(--text-secondary)',
            }}
          >
            Forecast-period environmental estimate
          </div>
        </div>

        <div className="col-span-6 panel">
          <div className="panel-header">
            <span className="panel-title">
              Solar Resource Input
            </span>
          </div>

          <div
            className="mono"
            style={{
              fontSize: 'var(--fs-28)',
              fontWeight: 700,
            }}
          >
            {data.environment.solarKwhM2Day.toFixed(2)}
            {' kWh/m²/day'}
          </div>

          <div
            style={{
              marginTop: 'var(--space-2)',
              fontSize: 'var(--fs-11)',
              color: 'var(--text-secondary)',
            }}
          >
            Forecast-period solar estimate
          </div>
        </div>
      </div>

      {/* Model Drivers */}
      <div className="grid-12">

        <div className="col-span-6">
          <ForecastDriversPanel
            drivers={data.drivers}
          />
        </div>

        <div className="col-span-6 panel">
          <div className="panel-header">
            <span className="panel-title">
              Model Evaluation
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 'var(--fs-11)',
                  color: 'var(--text-secondary)',
                }}
              >
                Model
              </div>

              <div className="mono">
                {data.modelVersion}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 'var(--fs-11)',
                  color: 'var(--text-secondary)',
                }}
              >
                MAE
              </div>

              <div className="mono">
                {Math.round(
                  data.modelEvaluation.maeKwh
                ).toLocaleString()} kWh
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 'var(--fs-11)',
                  color: 'var(--text-secondary)',
                }}
              >
                RMSE
              </div>

              <div className="mono">
                {Math.round(
                  data.modelEvaluation.rmseKwh
                ).toLocaleString()} kWh
              </div>
            </div>

            <div
              style={{
                fontSize: 'var(--fs-11)',
                color: 'var(--text-tertiary)',
              }}
            >
              Evaluated using a chronological
              20% holdout from the historical
              Mawson dataset.
            </div>
          </div>
        </div>
      </div>

      {/* Data & Method */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">
            Forecast Method
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
        >
          <div>
            Historical electricity demand is combined
            with temperature, solar resource,
            seasonal month, and lagged demand features.
          </div>

          <div
            style={{
              fontSize: 'var(--fs-11)',
              color: 'var(--text-secondary)',
            }}
          >
            Environmental inputs: {data.environment.source}
          </div>

          <div
            style={{
              fontSize: 'var(--fs-11)',
              color: 'var(--text-tertiary)',
            }}
          >
            Forecast type: {data.meta.forecastType}
          </div>
        </div>
      </div>
    </div>
  );
}