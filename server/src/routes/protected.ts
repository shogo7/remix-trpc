// server/src/routes/protected.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.get('/profile', requireAuth, (req, res) => {
  res.json({ message: 'ようこそ', user: req.user });
});

export default router;
