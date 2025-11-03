import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compileRouter from './routes/compile.js';
import examplesRouter from './routes/examples.js';

dotenv.config();

const app = express();
app.use(cors({ origin: '*'}));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'ebpl-server' });
});

app.use('/api/compile-run', compileRouter);
app.use('/api/examples', examplesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[ebpl-server] listening on http://localhost:${PORT}`);
});
