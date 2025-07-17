const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// ✅ Enable CORS for Angular dev server
app.use(cors({ origin: 'http://localhost:3001' }));


// ⬇️ Your upload folder
const uploadFolder = path.join(__dirname, 'saved_template');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });

// ⬇️ Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `template-${uniqueSuffix}.OL-template`);
  }
});
const upload = multer({ storage });

// ⬇️ API Route
app.post('/api/upload-template', upload.single('template'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const publicUrl = `/saved_template/${req.file.filename}`;
  res.json({ url: publicUrl });
});

// ⬇️ Serve saved templates
app.use('/saved_template', express.static(path.join(__dirname, 'saved_template')));

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
