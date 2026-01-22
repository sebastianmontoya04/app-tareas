//solicitamos express
const express = require('express')
//manejar las rutas mediante router express
const router = express.Router()
//desestructuramos cada funcion de los controladores
const { registrarUsuariosController,
    iniciarSesionController,
    crearTareaController,
    mostrarTareasController,
    actualizarTareaController,
    eliminarTareaController } = require('../controllers/auth.controller')

//ruta registrar usuarios
router.post('/registrar', registrarUsuariosController);
//ruta Iniciar sesion 
router.post('/login', iniciarSesionController);
//ruta Craer tareas
router.post('/crearTarea', crearTareaController);
//ruta Mostrar tareas
router.get('/mostrarTareas', mostrarTareasController);
//ruta Actualizar tareas
router.put('/actualizarTarea/:id', actualizarTareaController);
//ruta Eliminar tareas
router.delete('/eliminarTarea/:id', eliminarTareaController);

module.exports = router;