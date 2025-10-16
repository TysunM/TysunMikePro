import express from 'express';
import { createUser, authenticate } from '../auth.js';
import { q } from '../db.js';
import { sendMail } from '../mail.js';
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const user = await createUser(email, password, name);
    await q('INSERT INTO loyalty(user_id) VALUES($1) ON CONFLICT (user_id) DO NOTHING', [user.id]);
    await sendMail(email, 'Welcome to Tysun Mike Productions', `<p>Welcome, ${name || 'Artist'}! Your portal is ready.</p>`);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const auth = await authenticate(email, password);
  if (!auth) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: auth.token, user: { id: auth.user.id, email: auth.user.email, name: auth.user.name } });
});

export default router;
