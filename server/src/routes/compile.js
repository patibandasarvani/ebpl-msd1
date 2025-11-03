import { Router } from 'express';
import { runEbpl } from '../services/ebplRunner.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { code } = req.body || {};
    if (typeof code !== 'string') {
      return res.status(400).json({ error: 'code must be a string' });
    }
    const result = await runEbpl(code);
    res.json(result);
  } catch (err) {
    console.error('compile-run error', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

export default router;
