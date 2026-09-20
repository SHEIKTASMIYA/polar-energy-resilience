import { useState, useEffect } from 'react';
import { fetchDecisionSupport } from '../../../services/endpoints';
import { SeverityBadge } from '../../../components/status/SeverityBadge';
import { DataSourceTag } from '../../../components/status/DataSourceTag';
import { ShieldCheck, AlertTriangle, Lightbulb, ChevronRight } from 'lucide-react';

interface DecisionSupportData {
  overallStatus: 'NOMINAL' | 'WATCH' | 'CRITICAL';
  stationId: string;
  keyDrivers: { label: string; value: string; status: 'NOMINAL' | 'WATCH' | 'CRITICAL' }[];
  recommendations: { priority: string; category: string; action: string }[];
  meta: { source: string; retrievedAt: string; stationId: string };
}

interface ResilienceDecisionPanelProps {
  stationId: string;
}

export function ResilienceDecisionPanel({ stationId }: ResilienceDecisionPanelProps) {
  const [data, setData] = useState<DecisionSupportData | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchDecisionSupport(stationId)
      .then((res) => {
        if (isMounted) setData(res as DecisionSupportData);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [stationId]);

  if (!data) return null;

  return (
    <div className="panel" style={{ borderLeft: '4px solid var(--accent-ice)' }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="var(--accent-ice)" />
          <span className="panel-title">Operator Decision Support & Resilience Status</span>
          <DataSourceTag source="DERIVED" label="AI ADVISORY" />
        </div>
        <SeverityBadge severity={data.overallStatus} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-4)', marginTop: '4px' }}>
        {/* Key Drivers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            System Key Drivers
          </div>
          {data.keyDrivers.map((driver, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface-2)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '11px',
              }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>{driver.label}:</span>
              <span className="mono" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {driver.value}
              </span>
            </div>
          ))}
        </div>

        {/* Actionable Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Calculated Operator Guidance
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {data.recommendations.map((rec, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--surface-2)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  borderLeft: rec.priority === 'HIGH' ? '3px solid var(--severity-critical)' : '3px solid var(--accent-ice)',
                }}
              >
                <Lightbulb size={14} color="var(--accent-ice)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
                  <strong style={{ color: 'var(--accent-ice)', marginRight: '6px' }}>[{rec.category}]</strong>
                  {rec.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
