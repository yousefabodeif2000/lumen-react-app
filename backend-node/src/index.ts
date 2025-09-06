import express from 'express';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Node service running on http://localhost:${PORT}`);
});
