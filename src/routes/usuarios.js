const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const { verificarToken } = require('../middlewares/autenticacion');
const jwt = require('jsonwebtoken');

app.get('/usuarios', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, usersDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            Usuario.count({ estado: true }, (err, count) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                };

                if (usersDB) {
                    res.json({
                        ok: true,
                        usuarios: usersDB,
                        count
                    });
                };
            });
        });

});

app.post('/usuarios', (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };

        let token = jwt.sign({
            usuario: userDB
        }, 'Esta-es-mi-semilla-de-desarrollo', { expiresIn: 60 * 60 * 24 });

        res.json({
            ok: true,
            usuario: userDB,
            token
        })

    });

});

app.put('/usuarios/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'password'])


    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            usuario: userDB
        });

    });

});

app.delete('/usuarios/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let desactivar = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, desactivar, { new: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            usuario: {
                message: 'Usuario desactivado correctamente',
                userDB
            }
        })


    })

});

module.exports = app;