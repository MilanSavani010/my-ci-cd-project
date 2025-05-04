const express = require('express');
const app = express();
const port = 80;

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});