const router = require('express').Router();
const Player = require('../models/Player');
const AuraChange = require('../models/AuraChange');

// GET /api/players → only show yourself + your friends, sorted by aura
router.get('/', async (req, res) => {
  // builds an array of ObjectIds: yourself + each friend
  const circle = [ req.user._id, ...(req.user.friends || []) ];
  const players = await Player
    .find({ user: { $in: circle } })
    .sort({ aura: -1 });
  res.json(players);
});


// POST /api/players       → { name, aura? }
router.post('/', async (req, res) => {
  try {
    console.log('🔥 POST /api/players payload:', req.body);
    const { name, aura } = req.body;
    const newP = await Player.create({
      name,
      aura,
      user: req.user._id    // ← inject the logged‑in user
    });
    res.status(201).json(newP);
  } catch (err) {
    console.error('❌ Error creating player:', err);
    res.status(500).json({ error: 'Failed to create player' });
  }
});

// PATCH /api/players/:id  → { delta: +1 or -1 }
router.patch('/:id', async (req, res) => {
  const rawDelta = req.body.delta;
  const delta = Number(rawDelta) || 0;

  const p = await Player.findByIdAndUpdate(
    req.params.id,
    { $inc: { aura: delta } },
    { new: true }
  );

  // Record who did it
  await AuraChange.create({
    player: req.params.id,
    delta,
    user: req.user._id,          // requires your auth middleware to set req.user
    username: req.user.username, // whatever field you use for display name
  });

  res.json(p);
});


router.get('/:id/history', async (req, res) => {
  const changes = await AuraChange
    .find({ player: req.params.id })
    .sort({ createdAt: -1 });
  res.json(changes);
});

// DELETE /api/players/:id
router.delete('/:id', async (req, res) => {
  await Player.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;