import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3301;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
