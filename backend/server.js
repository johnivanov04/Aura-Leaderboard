require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const auth        = require('./middleware/auth');
const authRouter  = require('./routes/auth');
const friendsRouter = require('./routes/friends');
const playersRouter = require('./routes/players');

const app = express();
app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRouter);

// Protected routes (require valid JWT)
app.use('/api/friends', auth, friendsRouter);
app.use('/api/players', auth, playersRouter);

const PORT = process.env.PORT || 5050;
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ DB connection error:', err));

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
