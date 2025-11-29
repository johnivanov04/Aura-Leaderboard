// backend/routes/auth.js
require('dotenv').config();   // ensure .env is loaded if you’re running this file directly
const router  = require('express').Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const User    = require('../models/User');
const Player  = require('../models/Player');   // ← add this

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('🚨 JWT_SECRET not set in .env!');
  process.exit(1);
}

router.post('/register', async (req, res) => {
  try {
    console.log('[REGISTER] payload:', req.body);
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username & password required' });
    }
    if (await User.findOne({ username })) {
      return res.status(400).json({ error: 'username already taken' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      passwordHash: hash,
      friends: []
    });
    console.log('✅ Created user', user._id);

    // seed a Player document owned by this user
    const player = await Player.create({
      name: user.username,
      aura: 0,
      user: user._id
    });
    console.log('✅ Seeded player', player._id);

    return res.status(201).json({ id: user._id, username: user.username });
  } catch (err) {
    console.error('🔥 Error in /api/auth/register:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('[LOGIN] payload:', req.body);
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username & password required' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'invalid username or password' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'invalid username or password' });
    }

    const token = jwt.sign(
      { sub: user._id, username: user.username, friends: user.friends },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('✅ Login success, issuing token for', user.username);
    return res.json({ token });
  } catch (err) {
    console.error('🔥 Error in /api/auth/login:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
