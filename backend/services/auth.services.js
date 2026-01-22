//nos permite hashear la contraseña
const bcrypt = require('bcrypt')
//desectructuramos las funciones de los modelos
const { registrarUserModels,
    iniciarSesionModels,
    crearTareaModels,
    mostrarTareasModels, actualizarTareasModels,
    eliminarTareaModels } = require('../models/auth.models')

//funcion para registrar usuarios services que trae desde el frontend el nombre de usuario y la contraseña
exports.registrarUserServices = async ({ nombre_usuarios, password }) => {
    //condiciones 
    if (!nombre_usuarios || !password) {
        throw new Error('los campos no pueden estar vacios')
    }
    if (nombre_usuarios.length < 5) {
        throw new Error('El nombre de usuario debe tener al menos 5 letras')
    }
    if (password.length < 5) {
        throw new Error('La contraseña debe tener al menos 5 letras')
    }
    //encripta la password antes de guardar
    const hashearPassword = await bcrypt.hash(password, 10)
    //a la funcion de registrar usuario models le pasamos como parametro el nombre de usuario y la contraseña hasheada
    return await registrarUserModels(nombre_usuarios, hashearPassword)
}
//funcion para iniciar sesion services que trae desde el frontend el nombre de usuario y la contraseña
exports.iniciarSesionService = async ({ nombre_usuarios, password }) => {
    //condiciones 
    if (!nombre_usuarios || !password) {
        throw new Error('los campos no pueden estar vacios')
    }
    if (nombre_usuarios.length < 5) {
        throw new Error('El nombre de usuario debe tener al menos 5 letras')
    }
    if (password.length < 5) {
        throw new Error('La contraseña debe tener al menos 5 letras')
    }
    //a la funcion de iniciar sesion models le pasamos como parametro el nombre de usuario
    const user = await iniciarSesionModels(nombre_usuarios)
    //condicion si ese usuario no existe
    if (!user) {
        throw new Error('Usuario no encontrado')
    }

    //validamos si la contraseña hasheada es igual a la contraseña ingresada por el usuario
    const compararPassword = await bcrypt.compare(password, user.password);
    if (!compararPassword) {
        throw new Error('Contraseña incorrecta ')
    };
    //mandamos el user
    return user
}
//funcion para crear tarea services que trae desde el frontend el nombre de usuario y el estado
exports.crearTareaServices = async ({ nombre_tarea, estado }) => {
    //condicion
    if (!nombre_tarea || !estado) {
        throw new Error('Los campos no deben estar vacios')
    }
    //a la funcion de crear tarea models le pasamos como parametro el nombre de la tarea y el estado
    return await crearTareaModels(nombre_tarea, estado)
};
//funcion para mostrar tareas services 
exports.mostrarTareasServices = async () => {
    //a la funcion de mostrar tareas models le pasamos las tareas de el frontend
    return await mostrarTareasModels()
}
//funcion para actualizar tareas services que recibe como parametro el id y recibe el nombre de la tarea y el estado desde el frontend
exports.actualizarTareaServices = async (id, { nombre_tarea, estado }) => {
    //condiciones
    if (!nombre_tarea || !estado || !id) {
        throw new Error('Tarea no encontrada')
    }
    //a la funcion de actualizar tareas models le pasamos el id, nombre de la tarea y el estado
    return await actualizarTareasModels(id, nombre_tarea, estado)
};
//funcion para eliminar tareas services que recibe como parametro el id 
exports.eliminarTareaService = async (id) => {
    //condicion
    if (!id) {
        throw new Error('Tarea no encontrada')
    }
    //a la funcion de eliminar tareas models le pasamos el id
    return await eliminarTareaModels(id)
};