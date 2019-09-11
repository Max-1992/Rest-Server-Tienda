const express = require('express');
const app = express();

app.get('/usuarios', (req, res) => {
    res.json({
        ok: true,
        message: '/get'
    })
});

app.post('/usuarios/:id', (req, res) => {
    res.json({
        ok: true,
        message: '/post'
    })
});

app.put('/usuarios/:id', (req, res) => {
    res.json({
        ok: true,
        message: '/put'
    })
});

app.delete('/usuarios/:id', (req, res) => {
    res.json({
        ok: true,
        message: '/delete'
    })
});

module.exports = app;