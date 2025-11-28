const db = require('../db/server')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.registrarUsuarios = async (req, res) => {
    //datos enviados desde el front
    const { nombre_usuario, password } = req.body
    try {
        //encripta la password antes de guardar
        const hashearPassword = await bcrypt.hash(password, 10)
        //consulta a la base de datos
        const response = await db.query('INSERT INTO usuarios (nombre_usuarios, password) values ($1, $2) RETURNING *',
            [nombre_usuario, hashearPassword]
        );
        res.status(200).json({
            msg: 'Usuario creado correctamente',
            usuario: response.rows[0]
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Error al crear el usuario',
            error: error.message
        });
    }
}

exports.iniciarSesion = async (req, res) => {
    //datos recibidos desde el cliente
    const { nombre_usuario, password } = req.body
    try {
        const response = await db.query('SELECT * FROM usuarios WHERE nombre_usuarios = $1',
            [nombre_usuario]
        )
        if (response.rows.length === 0) {
            return res.status(400).json({
                msg: 'Usuario no encontrado'
            });
        };
        //guardamos el usuario en user
        const user = response.rows[0];
        //validamos si la contraseña es igual
        const compararPassword = await bcrypt.compare(password, user.password);
        if (!compararPassword) {
            return res.status(400).json({ msg: 'Contraseña incorrecta ' });
        };
        const token = jwt.sign({
            nombre_usuario: user.nombre_usuarios
        },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ msg: 'Inicio de sesion exitoso', token })

    } catch (error) {
        res.status(400).json({ msg: 'Error al iniciar sesion', error })
    }
}

exports.crearTarea = async (req, res) => {
    //datos recibidos desde el front
    const { nombre_tarea, estado } = req.body;
    try {
        //consulta a base de datos
        const response = await db.query('INSERT INTO tareas (nombre_tarea, estado) VALUES ($1, $2) RETURNING *',
            [nombre_tarea, estado]
        );
        //guardamos la tarea en data
        const data = response.rows[0];
        //condicional si no hay una tarea
        if (response.rows.length === 0) {
            return res.status(400).json({
                msg: 'Tarea no encontrada'
            });
        };
        res.status(200).json({
            msg: 'Tarea creada exitosamente',
            tarea: data
        });
    } catch (error) {
        res.status(400).json({ msg: 'Error al crear la tarea', error });
    };
};

exports.eliminarTarea = async (req, res) => {
    //tomamos el id como parametro
    const { id } = req.params;
    //consulta a la base de datos
    try {
        const response = await db.query('DELETE FROM tareas WHERE id = $1 RETURNING *',
            [id]
        );
        //condicional si no encontramos la tarea
        if (response.rows.length === 0) {
            return res.status(400).json({
                msg: 'Tarea no encontrada'
            });
        };
        //guardamos la tarea eliminada en data y se muestra al momento de eliminar
        const data = response.rows[0];
        res.status(200).json({
            msg: 'Tarea eliminada con exito',
            tarea: data
        });

    } catch (error) {
        res.status(400).json({
            msg: 'Error al eliminar la tarea', error
        });
    };
};

exports.mostrarTareas = async (req, res) => {
    try {
        //consulta a la base de datos
        const response = await db.query('SELECT * FROM tareas');
        //condicion si no hay tareas creadas
        if (response.rows.length === 0) {
            return res.status(400).json({
                msg: 'No hay tareas creadas'
            })
        }
        res.status(200).json({
            msg: 'Tareas solicitadas con exito',
            tareas: response.rows
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Error al solicitar las tareas',
            error
        })
    }
}

exports.actualizarTarea = async (req, res) => {
    //tomamos el id como parametro
    const { id } = req.params;
    //datos recibidos desde el front
    const { nombre_tarea, estado } = req.body;
    try {
        //consulta a la base de datos
        const response = await db.query('UPDATE tareas SET nombre_tarea = $2, estado= $3 WHERE id = $1 RETURNING *',
            [id, nombre_tarea, estado]
        );
        //condicion por si deja la tarea vacia
        if (response.rows.length === 0) {
            return res.status(400).json({
                msg: 'Debe asignar una nueva tarea'
            });
        };
        res.status(200).json({
            msg: 'Tarea actualizada con exito',
            tarea: response.rows
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Error al actualizar la tarea',
            error
        });
    };
};