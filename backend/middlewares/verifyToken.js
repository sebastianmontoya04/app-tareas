const jwt = require('jsonwebtoken')
require('dotenv').config()


exports.verificarToken = (req, res, next) => {
    const header = req.headers['authorization'];

    if (!header) return res.status(500).json({ msg: 'Token no proporcionado' })

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ msg: 'Token invalido o expirado' })
    }
};