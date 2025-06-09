// Importando o express (já instalado) e o path (nativo do Node.js)
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter o caminho do diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Criando a aplicação Express
const app = express();

// Definindo a porta (usando a variável de ambiente PORT ou 3000 por padrão)
const port = process.env.PORT || 3000;

// Middleware para remover/ajustar Content-Security-Policy (opcional, mas recomendado)
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:;");
  next();
});

// Impede erro 404 para favicon.ico e evita que o navegador reclame
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No Content
});

// Serve arquivos estáticos da pasta 'dist' (gerada pelo build do Vue.js)
app.use(express.static(path.join(__dirname, 'dist')));

// Roteamento para sempre servir o index.html para qualquer requisição
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Iniciando o servidor na porta definida
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
