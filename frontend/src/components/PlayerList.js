// src/components/PlayerList.js
import React from 'react';
import { Table, Button } from 'react-bootstrap';

export default function PlayerList({
  players,
  friends = [],
  currentUserName,     // ← NEW
  onInc,
  onDec,
  onDel,
  onHistory,
  onCustom,
  onAddFriend,
  onRemoveFriend,
  disabled
}) {
  if (players.length === 0) {
    return <p className="text-muted">No players yet.</p>;
  }

  // Sort by aura (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.aura - a.aura);

  return (
    <Table striped bordered hover className="mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Aura</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedPlayers.map((p, i) => {
          const rank = i + 1;
          const isFriend = friends.includes(p._id);
          const isSelf =
            currentUserName && p.name && p.name === currentUserName;

          // Highlight top 3
          let rowClass = '';
          let medal = null;
          if (rank === 1) {
            rowClass = 'table-warning';
            medal = '🥇';
          } else if (rank === 2) {
            rowClass = 'table-light';
            medal = '🥈';
          } else if (rank === 3) {
            rowClass = 'table-secondary';
            medal = '🥉';
          }

          return (
            <tr key={p._id} className={rowClass}>
              <td>
                {rank}
                {medal && <span className="ms-1">{medal}</span>}
              </td>
              <td>
                {p.name}
                {isSelf && (
                  <span className="badge bg-secondary ms-2">You</span>
                )}
                {!isSelf && isFriend && (
                  <span className="badge bg-info ms-2">Friend</span>
                )}
              </td>
              <td>{p.aura}</td>
              <td className="d-flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="success"
                  disabled={disabled}
                  onClick={() => onInc(p._id)}
                >
                  +1
                </Button>

                <Button
                  size="sm"
                  variant="warning"
                  disabled={disabled}
                  onClick={() => onDec(p._id)}
                >
                  −1
                </Button>

                {onCustom && (
                  <Button
                    size="sm"
                    variant="outline-success"
                    disabled={disabled}
                    onClick={() => {
                      const raw = window.prompt(
                        'Change aura by how much?',
                        '10'
                      );
                      if (raw == null || raw === '') return;
                      const delta = Number(raw);
                      if (!Number.isFinite(delta)) return;
                      onCustom(p._id, delta);
                    }}
                  >
                    Custom
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="primary"
                  disabled={disabled}
                  onClick={() => onHistory(p._id)}
                >
                  History
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  disabled={disabled}
                  onClick={() => onDel(p._id)}
                >
                  Delete
                </Button>

                {/* Only show friend buttons if this row is NOT me */}
                {!isSelf && (
                  isFriend ? (
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      disabled={disabled}
                      onClick={() => onRemoveFriend(p._id)}
                    >
                      Remove Friend
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline-primary"
                      disabled={disabled}
                      onClick={() => onAddFriend(p._id)}
                    >
                      Add Friend
                    </Button>
                  )
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
