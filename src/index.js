import 'dotenv/config';
import express from 'express';
import { getTrainingAdvice } from './coach.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// AI coaching endpoint
app.post('/api/coach/advice', async (req, res) => {
  try {
    const { weeks = 4 } = req.body;
    const result = await getTrainingAdvice(weeks);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`openGym AI Coach running on port ${PORT}`);
});