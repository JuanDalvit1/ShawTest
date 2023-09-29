const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

let data = [];

app.use(express.json());
app.use(cors());

app.post('/api/files', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  const fileContent = fs.readFileSync(file.path, 'utf-8');
  const rows = fileContent.split('\n').map(line => line.split(','));

  data = rows.slice(1); // Ignorar o cabeçalho

  fs.unlinkSync(file.path);
  res.send(data);
});

app.get('/api/users', (req, res) => {
  const query = req.query.q.toLowerCase();
  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value.toLowerCase().includes(query)
    )
  );
  res.send(filteredData);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
