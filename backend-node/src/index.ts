import express from 'express';
import cacheRouter from './routes/cacheRoutes';
import apiRouter from './routes/apiRoutes';
import cors from 'cors';
import http from 'http';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());
app.use('/cache', cacheRouter);
app.use('/api', apiRouter);
const server = http.createServer(app);

if (require.main === module) {
  // Only listen if running directly (not during tests)
  server.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
}

export {app,server};
