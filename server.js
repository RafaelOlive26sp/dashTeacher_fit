// Importando o express (já instalado) e o path (nativo do Node.js)
import express from 'express';
import path from 'path';
// Criando a aplicação Express
const app = express();
import { fileURLToPath } from 'url';

// Obter o caminho do diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Definindo a porta (usando a variável de ambiente PORT ou 3000 por padrão)
const port = process.env.PORT || 3000;

// Serve arquivos estáticos da pasta 'dist' (pasta gerada pelo build do Vue.js)
app.use(express.static(path.join(__dirname, 'dist')));

// Roteamento para sempre servir o index.html para qualquer requisição
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Iniciando o servidor na porta definida
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
