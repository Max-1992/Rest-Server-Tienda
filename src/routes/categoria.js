const express = require('express');
const { verificarToken, verificarRole } = require('../middlewares/autenticacion');
let Categoria = require('../models/categoria');

const app = express();

// Mostrar todas las categorias
app.get('/categoria', verificarToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario')
        .exec((err, categoriasDB) => {

            if (err) {
                return req.status(500).json({
                    ok: false,
                    categoriasDB
                })
            }

            res.json({
                ok: true,
                categoriasDB
            })
        })

})

// Mostrar una categoria por ID
app.get('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Categoria.findOne({ _id: id }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No hemos encontrado la categoria solicitada'
                }
            })
        }

        res.json({
            ok: true,
            categoriaDB
        })

    })

})

// Crear una nueva categoria
app.post('/categoria', verificarToken, (req, res) => {
    //Sacar el ID del req.usuario.id que nos retorna verificaToken.

    let id = req.usuario._id;
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })



})

app.put('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });

})

app.delete('/categoria/:id', [verificarToken, verificarRole], (req, res) => {
    // Solo un administrador puede borrar categorias

    let id = req.params.id;


    Categoria.findByIdAndRemove(id, (err, categoriaRemove) => {

        if (err) {
            return req.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaRemove) {
            return req.status(400).json({
                ok: false,
                err: {
                    message: 'No se a encontrado la categoria el recurso'
                }
            })
        }

        res.json({
            ok: true,
            categoria: {
                message: 'Hemos eliminado la categoria solicitada',
                categoriaRemove
            }
        })
    })

})


module.exports = app;