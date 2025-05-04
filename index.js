const express = require('express');
const cors = require('cors');

const app = express();
const port = 80;

app.use(cors());

app.use((req, res, next) => {
    console.log('Client IP:', req.ip);
    next();
});

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(port,'0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${port}`);
});
