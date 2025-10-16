import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { q } from '../db.js';
const router = express.Router();

// Admin: update project status for any user
router.post('/projects/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const r = await q('UPDATE projects SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *', [status, id]);
  res.json(r.rows[0] || {});
});

// Admin: increment loyalty mixes_completed when a project is delivered
router.post('/projects/:id/delivered', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const proj = await q('UPDATE projects SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *', ['delivered', id]);
  if (!proj.rows[0]) return res.status(404).json({ error: 'Not found' });
  const userId = proj.rows[0].user_id;
  await q('UPDATE loyalty SET mixes_completed = mixes_completed + 1 WHERE user_id=$1', [userId]);
  res.json({ ok: true });
});

export default router;
