import express from 'express';
import multer from 'multer';
import * as xlsx from 'xlsx';
import { sequelize, User } from './models/index';

const app = express();
const port = 3000;

app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json<{ Name: string; Email: string }>(sheet);
    for (const row of data) {
      await User.create({
        name: row.Name,
        email: row.Email,
      });
    }

    // Responder com status 200 OK
    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
