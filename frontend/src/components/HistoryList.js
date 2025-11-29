import React from 'react'

export default function HistoryList({ history }) {
  if (!history.length) {
    return <div className="text-gray-600">No changes yet.</div>
  }
  return (
    <ul className="space-y-1">
      {history.map(h => (
        <li key={h._id} className="flex justify-between">
          <span>
            {h.delta > 0 ? '+' : ''}{h.delta}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(h.createdAt).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  )
}
