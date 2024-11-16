const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the 'libs' folder as a static directory to load arte.js correctly
app.use('/libs', express.static(path.join(__dirname, 'libs')));

// POST endpoint to save editor content
app.post('/save', (req, res) => {
    const content = req.body.content;
    fs.writeFile('saved-content.html', content, (err) => {
        if (err) return res.status(500).send('Error saving content');
        res.send('Content saved successfully!');
    });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
