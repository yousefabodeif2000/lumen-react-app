/**
 * Node API Server
 *
 * Entry point for the Node.js API that provides:
 * - API routes that proxy requests to the Lumen backend
 * - Cache routes that fetch cached posts via Redis
 *
 * Middlewares:
 * - CORS configured for the frontend origin (http://localhost:5173)
 * - JSON body parsing
 *
 * Routers:
 * - /api  -> `apiRouter` (handles login, register, create/delete posts)
 * - /cache -> `cacheRouter` (handles cached GET requests)
 *
 * Notes:
 * - The server only starts listening when run directly (not during tests)
 * - HTTP server is exported for test integration or future socket usage
 */

import express from 'express';
import cacheRouter from './routes/cacheRoutes';
import apiRouter from './routes/apiRoutes';
import cors from 'cors';
import http from 'http';

const app = express();

// Enable CORS for frontend application
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Enable JSON request body parsing
app.use(express.json());

// Enable JSON request body parsing
app.use('/cache', cacheRouter);
app.use('/api', apiRouter);

// Create HTTP server
const server = http.createServer(app);

// Start listening only if running directly (not during tests)
if (require.main === module) {
  server.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
}

export {app,server};
