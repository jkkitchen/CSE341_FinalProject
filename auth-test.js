const express = require('express');
const app = express();

// Simple test routes
app.get('/test', (req, res) => {
    res.json({ message: 'Test works!', time: new Date().toISOString() });
});

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.get('/auth/github', (req, res) => {
    res.send('GitHub auth route - would redirect to GitHub');
});

app.get('/auth/google', (req, res) => {
    res.send('Google auth route - would redirect to Google');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Test server running at http://localhost:${PORT}`);
    console.log('Available routes:');
    console.log('  GET /test');
    console.log('  GET /ping');  
    console.log('  GET /auth/github');
    console.log('  GET /auth/google');
});