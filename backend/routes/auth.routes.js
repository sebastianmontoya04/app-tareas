const express = require('express')
//manejar las rutas mediante router express
const router = express.Router()

const { registrarUsuarios, iniciarSesion, crearTarea, eliminarTarea, mostrarTareas, actualizarTarea } = require('../services/auth.services')

//ruta registrar usuarios
router.post('/registrar', registrarUsuarios);
//ruta Iniciar sesion 
router.post('/login', iniciarSesion);
//ruta Craer tareas
router.post('/crearTarea', crearTarea);
//ruta Mostrar tareas
router.get('/mostrarTareas', mostrarTareas);
//ruta Actualizar tareas
router.put('/actualizarTarea/:id', actualizarTarea);
//ruta Eliminar tareas
router.delete('/eliminarTarea/:id', eliminarTarea);

module.exports = router;