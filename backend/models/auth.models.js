//requerimo la base de datos
const db = require('../db/server');
//funcion registrar usuario models que recibe como parametro el nombre de usuario y la contraseña hasheada
exports.registrarUserModels = async (nombre_usuarios, hashearPassword) => {
    //consulta para insertar los datos ingresados a la base de datos
    const result = await db.query('INSERT INTO usuarios (nombre_usuarios, password) VALUES ($1, $2) RETURNING *',
        [nombre_usuarios, hashearPassword]
    )
    //retornamos el objeto directamente
    return result.rows[0]
}
//funcion iniciar sesion models que recibe como parametro el nombre de usuario 
exports.iniciarSesionModels = async (nombre_usuarios) => {
    //consulta  a la base de datos
    const response = await db.query('SELECT * FROM usuarios WHERE nombre_usuarios = $1',
        [nombre_usuarios]
    )
    //retornamos el objeto directamente
    return response.rows[0]
}
//funcion crear tarea models que recibe como parametro el nombre de la tarea y el estado
exports.crearTareaModels = async (nombre_tarea, estado) => {
    //consulta para insertar los datos ingresados a la base de datos
    const response = await db.query('INSERT INTO tareas (nombre_tarea, estado) VALUES ($1, $2) RETURNING *',
        [nombre_tarea, estado]
    );
    return response.rows
}
//funcion mostrar tarea models
exports.mostrarTareasModels = async () => {
    //consulta  a la base de datos
    const response = await db.query('SELECT * FROM tareas');
    //retornamos el array
    return response.rows
}
//funcion actualizar tarea models que recibe como parametro el id, nombre de la tarea y el estado
exports.actualizarTareasModels = async (id, nombre_tarea, estado) => {
    //consulta  a la base de datos para actualizar las tareas
    const response = await db.query('UPDATE tareas SET nombre_tarea = $2, estado= $3 WHERE id = $1 RETURNING *',
        [id, nombre_tarea, estado]
    );
    //retornamos el objeto directamente
    return response.rows[0]
}
// funcion eliminar tarea models que recibe como parametro el id
exports.eliminarTareaModels = async (id) => {
    const response = await db.query('DELETE FROM tareas WHERE id = $1 RETURNING *',
        [id]
    );
    //retornamos el objeto directamente
    return response.rows[0]
}

