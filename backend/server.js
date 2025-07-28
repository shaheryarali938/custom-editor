const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

// Enable CORS for frontend IP (adjust as needed)
app.use(cors({ origin: 'http://www.yellowletterhq.com:3001' }));

// Set storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'saved_template'));
  },
  filename: (req, file, cb) => {
    const filename = `template-${Date.now()}-${Math.floor(Math.random() * 100000000)}.OL-template`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

app.post('/api/upload-template', upload.single('template'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const savedPath = `/saved_template/${req.file.filename}`;
  const localPath = path.join(__dirname, 'saved_template', req.file.filename);
  const templateType = req.body.templateType || "First Class Postcard (4.25 x 5.5)";

  const pythonPath = 'python'; // or 'python3' depending on your system
  const scriptPath = path.join(__dirname, 'auto_fill_form.py');

  exec(`"${pythonPath}" "${scriptPath}" "${templateType}" "${savedPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Python Error: ${error.message}`);
      return res.status(500).send('Python script failed.');
    }
    if (stderr) {
      console.warn(`⚠️ Python stderr: ${stderr}`);
    }
    console.log(`✅ Python Output:\n${stdout}`);
    res.json({ url: savedPath });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
