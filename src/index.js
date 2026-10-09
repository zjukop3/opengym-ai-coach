import http from 'node:http';
import { analyzeWorkouts } from './coach.js';

const PORT = process.env.PORT || 3000;

/**
 * Simple JSON request body parser
 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // Analyze endpoint
  if (req.method === 'POST' && req.url === '/api/analyze') {
    try {
      const body = await parseBody(req);
      if (!body.workouts || !Array.isArray(body.workouts)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '"workouts" array is required in the request body' }));
        return;
      }

      const result = await analyzeWorkouts(body.workouts);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      console.error('Analysis error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`🤖 openGym-AI-Coach server running on http://localhost:${PORT}`);
  console.log(`   Send POST request to /api/analyze with your openGym workout data`);
});