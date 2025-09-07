import express from 'express';
import cacheRouter from './routes/cacheRoutes';
import apiRouter from './routes/apiRoutes';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());
app.use('/cache', cacheRouter);
app.use('/api', apiRouter);

export default app;
