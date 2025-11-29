// src/components/RegisterForm.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

export default function RegisterForm() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState(null);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1) register
      await axios.post('/auth/register', { username, password });
      // 2) then auto‑login
      const res = await axios.post('/auth/login', { username, password });
      login(res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 border rounded">
      <h2 className="text-xl mb-4">Register</h2>

      {error && <div className="mb-2 text-red-600">{error}</div>}

      <div className="mb-3">
        <label className="block mb-1">Username</label>
        <input
          className="w-full border p-2"
          value={username}
          onChange={e => setUsername(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1">Password</label>
        <input
          type="password"
          className="w-full border p-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        className={`w-full p-2 text-white rounded ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
        disabled={loading}
      >
        {loading ? 'Registering…' : 'Register'}
      </button>
    </form>
  );
}
