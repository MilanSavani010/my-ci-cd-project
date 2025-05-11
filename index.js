const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const apikey = "1234567890abcdef1234567890abcdef";
const password = "SecretPass123!";
const aws = "AKIA1234567890ABCD";


app.use(cors({origin:"*"}));

app.use((req, res, next) => {
    console.log('Client IP:', req.ip);
    next();
});

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(port, () => {
    console.log(`Server is running on port :${port}`);
});
