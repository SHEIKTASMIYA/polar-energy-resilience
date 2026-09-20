import { useSolarResource } from './hooks/useSolarResource';
import { useStationContextStore } from '../../state/stationContextStore';
import { PageHeader } from '../../components/layout/PageHeader';
import { LoadingSkeleton } from '../../components/feedback/LoadingSkeleton';
import { TimeSeriesChart } from '../../components/charts/TimeSeriesChart';
import { DataSourceTag } from '../../components/status/DataSourceTag';
import { Sun, Thermometer, Wind } from 'lucide-react';

export function SolarResourcePage() {
  const { selectedStationId } = useStationContextStore();
  const { data, isLoading, error } = useSolarResource(selectedStationId);

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Solar & Climate Resource"
          subtitle="Loading Open-Meteo environmental forecast..."
        />
        <LoadingSkeleton height={320} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <PageHeader
          title="Solar & Climate Resource"
          subtitle="Unable to load environmental resource data"
        />
        <div
          className="panel"
          style={{ color: 'var(--text-secondary)' }}
        >
          {error?.message ||
            'Environmental resource data is currently unavailable.'}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      <PageHeader
        title="Solar & Climate Resource"
        subtitle="Open-Meteo shortwave radiation, temperature, and wind forecast for Mawson Station"
      />

      {/* Resource Summary */}
      <div className="grid-12">
        <div className="col-span-4">
          <div className="panel">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              <Sun
                size={20}
                color="var(--source-solar)"
              />

              <div>
                <div
                  style={{
                    fontSize: 'var(--fs-11)',
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                  }}
                >
                  Peak Shortwave Radiation
                </div>

                <div
                  className="mono"
                  style={{
                    fontSize: 'var(--fs-22)',
                    fontWeight: 700,
                    color: 'var(--source-solar)',
                  }}
                >
                  {data.resourceSummary.peakShortwaveRadiationWm2}
                  <span
                    style={{
                      fontSize: 'var(--fs-11)',
                      marginLeft: '4px',
                    }}
                  >
                    W/m²
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="panel">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              <Thermometer
                size={20}
                color="var(--severity-critical)"
              />

              <div>
                <div
                  style={{
                    fontSize: 'var(--fs-11)',
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                  }}
                >
                  Forecast Hours
                </div>

                <div
                  className="mono"
                  style={{
                    fontSize: 'var(--fs-22)',
                    fontWeight: 700,
                  }}
                >
                  {data.resourceSummary.forecastHours}
                  <span
                    style={{
                      fontSize: 'var(--fs-11)',
                      marginLeft: '4px',
                    }}
                  >
                    hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="panel">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              <Wind
                size={20}
                color="var(--accent-ice)"
              />

              <div>
                <div
                  style={{
                    fontSize: 'var(--fs-11)',
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                  }}
                >
                  Average Shortwave Radiation
                </div>

                <div
                  className="mono"
                  style={{
                    fontSize: 'var(--fs-22)',
                    fontWeight: 700,
                    color: 'var(--accent-ice)',
                  }}
                >
                  {data.resourceSummary.averageShortwaveRadiationWm2.toFixed(1)}
                  <span
                    style={{
                      fontSize: 'var(--fs-11)',
                      marginLeft: '4px',
                    }}
                  >
                    W/m²
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shortwave Radiation */}
      <div className="panel">
        <div className="panel-header">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <Sun
              size={15}
              color="var(--source-solar)"
            />

            <span className="panel-title">
              Shortwave Solar Radiation
            </span>

            <DataSourceTag
              source="OPEN_METEO"
              label="OPEN-METEO"
            />
          </div>
        </div>

        <TimeSeriesChart
          data={data.points}
          series={[
            {
              key: 'shortwaveRadiationWm2',
              name: 'Shortwave Radiation W/m²',
              color: 'var(--source-solar)',
            },
          ]}
          height={280}
          yAxisUnit="W/m²"
        />
      </div>

      {/* Temperature */}
      <div className="panel">
        <div className="panel-header">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <Thermometer
              size={15}
              color="var(--severity-critical)"
            />

            <span className="panel-title">
              Ambient Temperature Forecast
            </span>

            <DataSourceTag
              source="OPEN_METEO"
              label="OPEN-METEO"
            />
          </div>
        </div>

        <TimeSeriesChart
          data={data.points}
          series={[
            {
              key: 'ambientTempC',
              name: 'Ambient Temperature °C',
              color: 'var(--severity-critical)',
            },
          ]}
          height={220}
          yAxisUnit="°C"
        />
      </div>

      {/* Wind */}
      <div className="panel">
        <div className="panel-header">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <Wind
              size={15}
              color="var(--accent-ice)"
            />

            <span className="panel-title">
              Wind Speed Forecast
            </span>

            <DataSourceTag
              source="OPEN_METEO"
              label="OPEN-METEO"
            />
          </div>
        </div>

        <TimeSeriesChart
          data={data.points}
          series={[
            {
              key: 'windSpeedKmh',
              name: 'Wind Speed km/h',
              color: 'var(--accent-ice)',
            },
          ]}
          height={220}
          yAxisUnit="km/h"
        />
      </div>

      {/* Data Source Note */}
      <div
        className="panel"
        style={{
          fontSize: 'var(--fs-11)',
          color: 'var(--text-secondary)',
        }}
      >
        <strong style={{ color: 'var(--text-primary)' }}>
          Data source:
        </strong>{' '}
        {data.meta.source}. The solar series reports Open-Meteo
        shortwave radiation directly. GHI, DNI, installed PV
        capacity, and PV energy yield are not inferred from this
        dataset.
      </div>
    </div>
  );
}