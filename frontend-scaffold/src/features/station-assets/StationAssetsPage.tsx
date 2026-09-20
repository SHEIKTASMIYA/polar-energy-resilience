import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { fetchStationAssets } from '../../services/endpoints';
import { type StationAsset } from '../../mocks/assets.mock';
import { SeverityBadge } from '../../components/status/SeverityBadge';
import { LoadingSkeleton } from '../../components/feedback/LoadingSkeleton';
import { useStationContextStore } from '../../state/stationContextStore';
import { Server, Cpu, Battery, Sun } from 'lucide-react';

export function StationAssetsPage() {
  const { selectedStationId } = useStationContextStore();
  const [assets, setAssets] = useState<StationAsset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchStationAssets(selectedStationId)
      .then((data) => {
        if (isMounted) {
          setAssets(data as StationAsset[]);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [selectedStationId]);

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Station & Asset Registry" subtitle="Loading operational asset registry..." />
        <LoadingSkeleton height={280} count={2} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Station & Asset Registry" subtitle="Unable to load asset registry" />
        <div className="panel" style={{ color: 'var(--text-secondary)' }}>
          {error.message}
        </div>
      </div>
    );
  }

  const getAssetIcon = (category: StationAsset['category']) => {
    switch (category) {
      case 'generator':
        return <Cpu size={20} color="var(--source-genset)" />;
      case 'battery':
        return <Battery size={20} color="var(--source-battery)" />;
      case 'solar':
        return <Sun size={20} color="var(--source-solar)" />;
      default:
        return <Server size={20} color="var(--accent-ice)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="Station & Asset Registry"
        subtitle="Operational registry of diesel generators, battery storage, and solar array infrastructure"
      />

      {/* Asset Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
        {assets.map((asset) => (
          <div key={asset.id} className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                {getAssetIcon(asset.category)}
                <div>
                  <h3 style={{ margin: 0, fontSize: 'var(--fs-15)', color: 'var(--text-primary)' }}>{asset.name}</h3>
                  <div style={{ fontSize: 'var(--fs-11)', color: 'var(--text-secondary)' }}>{asset.location}</div>
                </div>
              </div>
              <SeverityBadge severity={asset.status} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '8px 0' }}>
              <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>Capacity:</span>
              <span className="mono" style={{ fontSize: 'var(--fs-15)', fontWeight: 700, color: 'var(--accent-ice)' }}>
                {asset.capacity}
              </span>
            </div>

            {/* Health Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-11)' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Health & Reliability Index</span>
                <span className="mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  {asset.healthPercent}%
                </span>
              </div>
              <div
                style={{
                  height: '6px',
                  width: '100%',
                  backgroundColor: 'var(--surface-2)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${asset.healthPercent}%`,
                    backgroundColor: asset.healthPercent > 90 ? 'var(--severity-nominal)' : 'var(--severity-watch)',
                  }}
                />
              </div>
            </div>

            {/* Technical Specs */}
            <div
              style={{
                background: 'var(--surface-2)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-3)',
                marginTop: 'var(--space-2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                fontSize: 'var(--fs-11)',
              }}
            >
              {Object.entries(asset.specifications).map(([key, val]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>{key}:</span>
                  <span className="mono" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              <span>Last Maint: {asset.lastMaintenance}</span>
              <span>Next Maint: {asset.nextMaintenance}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
