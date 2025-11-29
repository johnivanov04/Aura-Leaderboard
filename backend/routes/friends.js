const router = require('express').Router();
const User   = require('../models/User');

// POST /api/friends/:id  → add friend
router.post('/:id', async (req, res) => {
  const friendId = req.params.id;
  // avoid duplicates
  if (!req.user.friends.includes(friendId)) {
    req.user.friends.push(friendId);
    await req.user.save();
  }
  res.sendStatus(204);
});

// DELETE /api/friends/:id  → remove friend
router.delete('/:id', async (req, res) => {
  req.user.friends = req.user.friends.filter(f=>f.toString()!==req.params.id);
  await req.user.save();
  res.sendStatus(204);
});

// GET /api/friends → return your current friend list
router.get('/', (req, res) => {
  res.json(req.user.friends);
});

module.exports = router;
