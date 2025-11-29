import React, { useState } from 'react';

export default function NewPlayerForm({ onAdd, disabled }) {
  const [name, setName] = useState('')
  const [aura, setAura] = useState(0)

  const handleSubmit = e => {
    e.preventDefault()
    if (!name) return
    onAdd(name, aura)
    setName('')
    setAura(0)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex space-x-2">
      <input
        className="border p-2 flex-1"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        disabled={disabled}
      />
      <input
        type="number"
        className="border p-2 w-20"
        value={aura}
        onChange={e => setAura(Number(e.target.value))}
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled}
        className={`px-4 rounded text-white ${
          disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        Add
      </button>
    </form>
  )
}
