const express = require('express');
const { verificarToken } = require('../middlewares/autenticacion');
const Producto = require('../models/producto');
const app = express();

//Buscar todos los productos
app.get('/productos', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario')
        .populate('categoria')
        .exec((err, producstDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.status(200).json({
                ok: true,
                producstDB
            })
        })




});


//Buscar un producto
app.get('/productos/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario')
        .populate('categoria')
        .exec((err, productDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no fue encontrado'
                    }
                })
            }

            res.status(200).json({
                ok: true,
                productDB
            })
        })

})

//Crear un producto
app.post('/productos', verificarToken, (req, res) => {

    let body = req.body;
    let id = req.usuario._id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        usuario: id,
        categoria: body.categoria
    })

    producto.save((err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productDB
        })

    })

});

//Actualizar un producto
app.put('/productos/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto solicitado no existe'
                }
            })
        }

        res.status(200).json({
            ok: true,
            producto: {
                message: 'El produto se actualizo correctamente',
                productDB
            }
        })
    })

});

//Borrar un producto
app.delete('/productos/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    const NO_disponible = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, NO_disponible, { new: true }, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No encontramos el producto en nuestra DB'
                }
            })
        }

        res.status(200).json({
            ok: true,
            producto: {
                message: 'El producto ha sido actualizado y no se encuentra disponible',
                productDB
            }

        })
    })

});

module.exports = app;