//requerimos el JWT
const jwt = require('jsonwebtoken')
//para utilizar las variables de entorno
require('dotenv').config()
//desestructuramos las funciones de los servicios
const { registrarUserServices,
    iniciarSesionService,
    crearTareaServices,
    mostrarTareasServices,
    actualizarTareaServices,
    eliminarTareaService } = require('../services/auth.services')

// funcion de controllers para registrar usuarios
exports.registrarUsuariosController = async (req, res) => {
    try {
        //a la funcion de registrar usuarios de services le pasamos lo que trae el frontend
        const registerUser = await registrarUserServices(req.body)
        res.status(200).json({
            msg: 'Usuario creado correctamente',
            usuario: registerUser
        });
    } catch (error) {
        res.status(400).json({
            msg: error.message
        });
    }
};
// funcion de controllers para iniciar sesion
exports.iniciarSesionController = async (req, res) => {
    try {
        //a la funcion de iniciar sesion de services le pasamos lo que trae el frontend
        const userLogin = await iniciarSesionService(req.body);
        //generamos el token
        const token = jwt.sign({
            //traemos el nombre de el usuario desde iniciarSesionService porque enviamos lo que trae el frontend pero a la vez tambien lo recibimos
            nombre_usuario: userLogin.nombre_usuarios
        },
        //pasamos la JWT secret desde .env
            process.env.JWT_SECRET,
            //tiempo que el token expira
            { expiresIn: '1hr' });
        res.status(200).json({
            //pasamos el token al momento de iniciar sesion
            msg: 'Inicio de sesion exitoso', token
        })
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}
// funcion de controllers para crear tarea
exports.crearTareaController = async (req, res) => {
    try {
        //a la funcion de crear tarea de services le pasamos lo que trae el frontend
        const newTarea = await crearTareaServices(req.body);
        res.status(200).json({
            msg: 'Tarea creada con exito',
            //le pasamos la tarea creada
            tarea: newTarea
        })
    } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    }
}
// funcion de controllers para mostrar tareas
exports.mostrarTareasController = async (req, res) => {
    try {
        //a la funcion de mostrar tareas de services le pasamos lo que trae el frontend
        const mostrarTareas = await mostrarTareasServices(req.body);
        res.status(200).json({
            msg: 'Tareas mostradas correctamente',
            //enviamos todas las tareas
            mostrarTareas
        })
    } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    }
}
// funcion de controllers para actualizar tareas
exports.actualizarTareaController = async (req, res) => {
    //recibimos el id como parametro desde el frontend
    const { id } = req.params;
    try {
        //a la funcion de actualizar tareas de services le pasamos lo que trae el frontend y el id recibido como parametro
        const updateTarea = await actualizarTareaServices(id, (req.body));
        res.status(200).json({
            //enviamos la tarea actualizada
            msg: 'Tarea actualizada correctamente', updateTarea
        })
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}
// funcion de controllers para eliminar tareas
exports.eliminarTareaController = async (req, res) => {
    //recibimos el id como parametro desde el frontend
    const { id } = req.params;
    try {
        //a la funcion de actualizar tareas de services le pasamos el id recibido como parametro
        await eliminarTareaService(id);
        res.status(200).json({
            msg: 'Tarea eliminada con exito'
        })
    } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    }
}