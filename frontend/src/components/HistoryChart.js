// src/components/HistoryChart.js
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function HistoryChart({ history }) {
  if (!history || history.length === 0) return null;

  // Sort by time ascending
  const sorted = [...history].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  let runningAura = 0;

  const data = sorted.map((h) => {
    // delta might be "1", "+1", "-1", number, or even null
    const parsed = parseFloat(h.delta);
    const delta = Number.isFinite(parsed) ? parsed : 0;

    runningAura += delta;

    return {
      // x-axis label
      time: new Date(h.createdAt).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      }),
      // y-axis value
      aura: runningAura,
    };
  });

  return (
    <div style={{ width: '100%', height: 260, marginBottom: '1rem' }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`aura : ${value}`, '']}
            labelFormatter={(label) => label}
          />
          <Line
            type="monotone"
            dataKey="aura"
            stroke="#007bff"
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
