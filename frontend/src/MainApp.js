// src/MainApp.js

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import NewPlayerForm from './components/NewPlayerForm';
import PlayerList from './components/PlayerList';
import HistoryList from './components/HistoryList';
import axios from 'axios';

const API = 'http://localhost:5050/api';

export default function MainApp() {
  const { logout, user } = useContext(AuthContext);

  // ----- title editing -----
  const [title, setTitle] = useState(
    () => localStorage.getItem('leaderboardTitle') || 'Aura Leaderboard'
  );
  const [editingTitle, setEditingTitle] = useState(false);

  // ----- core data -----
  const [players, setPlayers] = useState([]);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [friends, setFriends] = useState([]); // array of player IDs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ----- UI filters -----
  const [showFriendsOnly, setShowFriendsOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // ← new search bar state

  // ----- API helpers -----
  const fetchPlayers = async () => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/players`);
      setPlayers(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const { data } = await axios.get(`${API}/friends`);
      setFriends(data);
    } catch (e) {
      console.error('Failed to load friends', e);
    }
  };

  const fetchHistory = async id => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/players/${id}/history`);
      setHistory(data);
      setSelected(id);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const addPlayer = async (name, aura) => {
    setError(null);
    setLoading(true);
    try {
      await axios.post(`${API}/players`, { name, aura });
      await fetchPlayers();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const updateAura = async (id, delta) => {
    setError(null);
    setLoading(true);
    try {
      await axios.patch(`${API}/players/${id}`, { delta });
      await fetchPlayers();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const deletePlayer = async id => {
    setError(null);
    setLoading(true);
    try {
      await axios.delete(`${API}/players/${id}`);
      await fetchPlayers();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  // ----- initial load -----
  useEffect(() => {
    fetchPlayers();
    fetchFriends();
  }, []);

  const username = user?.username;

  // ----- filtering & search -----

  // first: friends-only logic (but always include "me")
  const basePlayers = showFriendsOnly
    ? players.filter(
        p => friends.includes(p._id) || (username && p.name === username)
      )
    : players;

  // second: search by name (case-insensitive)
  const playersFiltered = searchTerm
    ? basePlayers.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : basePlayers;

  return (
    <div className="container mx-auto p-4">
      {/* header: title + logout */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          {editingTitle ? (
            <form
              className="d-flex align-items-center gap-2"
              onSubmit={e => {
                e.preventDefault();
                const trimmed = title.trim() || 'Aura Leaderboard';
                setTitle(trimmed);
                localStorage.setItem('leaderboardTitle', trimmed);
                setEditingTitle(false);
              }}
            >
              <input
                className="form-control form-control-sm"
                style={{ maxWidth: 260 }}
                value={title}
                onChange={e => setTitle(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn btn-sm btn-primary">
                Save
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setEditingTitle(false)}
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <h1 className="mb-0">{title}</h1>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setEditingTitle(true)}
              >
                Edit title
              </button>
            </div>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">


          <button className="btn btn-danger ms-3" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Friends-only toggle */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="friendsOnlyToggle"
            checked={showFriendsOnly}
            onChange={e => setShowFriendsOnly(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="friendsOnlyToggle">
            Friends only
          </label>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search players by name…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-danger text-white p-3 mb-4 rounded">
          <p className="mb-2">Error: {error.message}</p>
          <button
            onClick={() => (selected ? fetchHistory(selected) : fetchPlayers())}
            className="btn btn-light btn-sm"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div>Loading…</div>
      ) : (
        <>
          <NewPlayerForm onAdd={addPlayer} disabled={loading} />

          <PlayerList
            players={playersFiltered}
            friends={friends}
            currentUserName={username}
            onInc={id => updateAura(id, +1)}
            onDec={id => updateAura(id, -1)}
            onDel={deletePlayer}
            onHistory={fetchHistory}
            onCustom={(id, delta) => updateAura(id, delta)}
            onAddFriend={async id => {
              await axios.post(`${API}/friends/${id}`);
              await fetchFriends();
            }}
            onRemoveFriend={async id => {
              await axios.delete(`${API}/friends/${id}`);
              await fetchFriends();
            }}
            disabled={loading}
          />

          {selected && (
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="h5 mb-0">
                  History for{' '}
                  {players.find(p => p._id === selected)?.name}
                </h2>
                <button
                  onClick={() => setSelected(null)}
                  className="btn btn-outline-secondary btn-sm"
                >
                  Close History
                </button>
              </div>
              <HistoryList history={history} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
