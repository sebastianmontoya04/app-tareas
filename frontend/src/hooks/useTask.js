//importaciones
import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "@/api";

export const useTask = () => {
    //estado que almacena todas las tareas
    const [mostrarTasks, setMostrarTasks] = useState([]);
    //funcion para mostrar las tareas
    const mostrarTareas = async () => {
        try {
            //consumimos el endpoint de mostrarTareas que manda el backend
            const res = await axios.get(`${API_URL}/auth/mostrarTareas`);
            //al estado de las tareas le pasamos las tareas qe trae el backend en este caso res
            setMostrarTasks(res.data.mostrarTareas || [])
        } catch (error) {
            console.log("Error al mostrar las tareas", error);
            setMostrarTasks([]);
        }
    }   
    //funcion para crear las tareas que recibe como parametro el nombre de la tarea y el estado
    const crearTareas = async ({ nombre_tarea, estado }) => {
        try {
            //consumimos el endpoint de crearTareas que manda el backend y le enviamos los 2 parametros esperados, nombre_tarea y estado
            const res = await axios.post(`${API_URL}/auth/crearTarea`, {
                nombre_tarea,
                estado,
            });
            //al estado de las tareas le pasamos las tareas viejas y las remplazamos por las nuevas
            setMostrarTasks(tareasViejas => [...tareasViejas, res.data.tarea[0]])
            return res.data.tarea
        } catch (error) {
            console.log('Error al crear la tarea')
        }
    };
    //funcion para eliminar las tareas
    const eliminarTarea = async (id) => {
        try {
            //solicitamos el endpoint eliminarTarea de el backend
            await axios.delete(`${API_URL}/auth/eliminarTarea/${id}`);

            //al el estado de las tareas, prev trae las tareas viejas despues filter recorre todas las tareas y solo me retorna las tareas difrentes al id de la tarea que quiero eliminar
            setMostrarTasks(prev => prev.filter(task => task.id !== id));
        } catch (error) {
            console.log("Error al eliminar la tarea");
        }
    };
    //funcion para modificar las tareas que trae el id de la tarea y espera como parametro el nombre de la tarea y el estado
    const modificarTarea = async (id, { nombre_tarea, estado }) => {
        try {
            //solicitamos el endpoint actualizarTarea de el backend y le pasamos nombre_tarea y estado
            await axios.put(`${API_URL}/auth/actualizarTarea/${id}`, {
                nombre_tarea,
                estado
            }
            );
            //al estado que tiene todas las tareas le pasamos las tareas viejas, recorremos esas tareas con .map y si el id de la tarea es igual al id de la tarea que queremos editar entonces copiamos la informacion de la tarea y lo remplazamos por la nueva informacion de la tarea, dado el caso que el id no sea igual le mandamos la tarea que estaba desde el principio 
            setMostrarTasks(prev => prev.map(tarea =>
                tarea.id === id
                    ? {
                        ...tarea,
                        nombre_tarea,
                        estado
                    }
                    : tarea
            ))
        } catch (error) {
            console.log("Error al modificar la tarea");
        }
    };
    //renderizamos mostrarTareas
    useEffect(() => {
        mostrarTareas()
    }, []);
    //desde la funcion useTask(hook) enviamos cada funcion y el estado de las tareas
    return {
        mostrarTasks,
        mostrarTareas,
        crearTareas,
        eliminarTarea,
        modificarTarea
    }
}