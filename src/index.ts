import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Server running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
