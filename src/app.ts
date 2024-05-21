import express from 'express';
import multer from 'multer';
import path from 'path';
import xlsx from 'xlsx';
import { User } from './models';

const app = express();
const port = 3000;

// Definindo o armazenamento em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Lendo os dados do arquivo diretamente da memória
  const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json<{ Name: string; Email: string }>(sheet);

  // Exemplo de inserção no banco de dados
  for (const row of data) {
    await User.create({
      name: row.Name,
      email: row.Email,
    });
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
