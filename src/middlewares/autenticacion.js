const jwt = require('jsonwebtoken');

// VERIFICAR TOKEN

let verificarToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, 'Esta-es-mi-semilla-de-desarrollo', (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        };

        req.usuario = decoded.usuario;
        next();

    })
}


module.exports = {
    verificarToken
}