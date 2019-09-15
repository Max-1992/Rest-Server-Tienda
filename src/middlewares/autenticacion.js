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

// VERIFICAR ROLE

const verificarRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next()
    } else {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El usuario no posee permisos de administrador'
            }
        })
    }

}


module.exports = {
    verificarToken,
    verificarRole
}