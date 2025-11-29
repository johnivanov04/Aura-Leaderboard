// src/components/StatsSidebar.js
import React, { useMemo } from 'react';

export default function StatsSidebar({ players }) {
  const stats = useMemo(() => {
    if (!players || !players.length) return null;

    const totalAura = players.reduce((sum, p) => sum + (p.aura || 0), 0);
    const avgAura = totalAura / players.length;
    const highest = players.reduce(
      (best, p) => (p.aura > (best?.aura ?? -Infinity) ? p : best),
      null
    );

    return { avgAura, highest };
  }, [players]);

  if (!stats) return null;

  return (
    <div className="card mb-3">
      <div className="card-header">Summary</div>
      <div className="card-body">
        <p className="mb-1">
          <strong>Average aura:</strong> {stats.avgAura.toFixed(2)}
        </p>
        {stats.highest && (
          <p className="mb-0">
            <strong>Highest aura:</strong> {stats.highest.name} (
            {stats.highest.aura})
          </p>
        )}
      </div>
    </div>
  );
}
