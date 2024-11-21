const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set up file upload
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded successfully', filePath: `/uploads/${req.file.filename}` });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
