const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || 'thisissecret';
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Home page

app.get('/', (req, res) => {
    res.status(200).send(`<h1> This is Home Page </h1>`);
})


// To get JWT Token

app.post('/token', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ type: 'error', message: 'email or password missing' });
    }

    // Generate Token

    const token = jwt.sign({ email, password }, SECRET);

    res.status(200).json({ email, password, token });
})


// To get details based on JWT

app.get('/token', (req, res) => {

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        res.status(400).json({ type: 'error', message: 'token missing or wrong' });
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET);
        res.status(200).json({ ...decoded });
    } catch (error) {
        res.status(401).json({ type: 'error', message: 'token corrupted' });
    }

})

app.listen(PORT, () => {
    console.log(`listening at port ${PORT}`);
})
