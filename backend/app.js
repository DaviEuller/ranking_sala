import express from 'express';
import cors from 'cors';

import usuarioRoutes from './Routes/usuario.routes.js';
import equipesRoutes from './Routes/equipes.routes.js';
const app = express();

app.use(express.json());
app.use(cors());

app.use('/usuarios', usuarioRoutes);
app.use('/equipes', equipesRoutes);

app.get('/', (req, res) => {
  res.json({ api: "API" });
});

export default app;