//importaciones
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useTask } from "../hooks/useTask"
import Swal from 'sweetalert2';
import * as React from "react"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardHeader
} from "@/components/ui/card"


export const Dashboard = () => {
  const navigate = useNavigate();
  //estados de las tareas
  const [nombreTarea, setNombreTarea] = useState("");
  const [estado, setEstado] = useState("");

  //opciones de estado de las tareas que tambien las utilizamos para el filtro de busqueda
  const opciones = ['realizado', 'pendiente', 'en proceso'];

  // ===== MODAL =====
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditando, setModalEditando] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState("");

  // =====filtro estado =====
  const [filtroEstado, setFiltroEstado] = useState('')

  // ===== AUTH =====
  const token = localStorage.getItem("token");
  const decode = jwtDecode(token);
  const nombre = decode.nombre_usuario;
  // DESESTRUCTURACION
  const { crearTareas,
    eliminarTarea,
    modificarTarea,
    mostrarTasks } = useTask()

  // ===== CRUD =====
  //FUNCION AGREGAR TAREAS
  const agregarTarea = async () => {
    //condicional por si el usuario no ingresa el nombre de la tarea ni selecciona el estado
    if (!nombreTarea || !estado) {
      Swal.fire({
        icon: 'error',
        title: 'Los campos no deben estar vacios'
      });
    }
    //variable que llama la funcion crearTareas que esta en el hook useTask
    const newTarea = await crearTareas({
      nombre_tarea: nombreTarea,
      estado
    })
    //condicion por si nombre tarea ni estado no existen
    if (!newTarea) return;
    //si nombre tarea y estado existen resetiamos los inputs
    setNombreTarea('')
    setEstado('')
  };
  //funcion para eliminar tarea que recibe como parametro el id de la tarea
  const deleteTarea = async (id) => {
    //espera la funcion traida desde el hook useTask
    await eliminarTarea(id)
  };

  //funcion que abre el modal y recibe como parametro las tareas
  const abrirModal = (task) => {
    //al modal le pasamos la tarea la cual vamos a editar
    setModalEditando(task);
    //al estado de el nuevo nombre de la tarea le pasamos la nueva tarea
    setNuevoNombre(task.nombre_tarea);
    //al estado de el estado de la tarea le pasamos el nuevo estado
    setNuevoEstado(task.estado);
    setModalOpen(true)
  };

  const updateTarea = async () => {
    //solicitamos la funcion modificarTarea desde el hook useTaks y sacamos el id de la tarea desde modal editando que ya trae todas las tareas
    await modificarTarea(modalEditando.id, {
      //enviamos el nuevo nombre y nuevo estado de la tarea
      nombre_tarea: nuevoNombre,
      estado: nuevoEstado,
    })

    //cerramos el modal
    setModalOpen(false);
  };
  //filtro de tareas: si filtroEstado trae el estado de la tarea entonces recorremos mostrarTask que trae todas las tareas con filter, y mostramos solo las tareas con el estado que espera filtroEstado, sea pendiente, en proceso o realizado, si filtroEstado no trae ninguna estado de la tarea entonces mostramos todas las tareas
  const tareasFiltradas = filtroEstado
    ? mostrarTasks.filter(task => task.estado === filtroEstado)
    : mostrarTasks;

  //funcion que cuando cierra sesion elimina el token de localStorage y redirige al login
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/Login', { replace: true });
  }

  return (
    <>
      <div className="min-h-screen w-full flex flex-col font-sans bg-white">
        <div className="flex flex-col md:flex-row flex-1">
          {/* Left Panel */}
          <div className="w-full md:w-[45%] bg-[#7da0eb] p-8 pt-12 flex flex-col items-center text-white relative">
            <div className="max-w-md w-full space-y-8 z-10 flex flex-col items-center">
              <div className="text-center space-y-2">
                <h1 className="text-5xl font-bold tracking-tight">
                  ¡Bienvenido!
                </h1>
                <p className="text-2xl opacity-90 font-light text-white/90">
                  {/* desestructuracion de nombre desde el token */}
                  {nombre}
                </p>

                <p className="text-xl mt-8 leading-snug max-w-[300px] mx-auto pt-4">
                  Esta app te permitira organizar tus tareas de forma eficiente y ordenada
                </p>
              </div>

              {/* Add Task */}
              <Card className="w-full max-w-sm">
                <CardHeader>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name-1">Nombre tarea</Label>
                      <Input
                        id="name-1"
                        name="name"
                        placeholder="Ingresa el nombre de la tarea"
                        // el valor del input va a ser nombre tarea
                        value={nombreTarea}
                        //a nombre tarea le pasamos el valor que escriba en el input
                        onChange={(e) => setNombreTarea(e.target.value)} />
                    </div>

                    <div className="space-y-2 relative">
                      <NativeSelect
                        // el valor del input va a ser nombre tarea
                        value={estado}
                        //a nombre estado le pasamos el valor que seleccione en el input(select)
                        onChange={(e) => setEstado(e.target.value)}
                      >
                        <NativeSelectOption value="">Estado</NativeSelectOption>
                        {/* recorremos el array de las opciones */}
                        {opciones.map((opt) => (
                          <NativeSelectOption key={opt} value={opt}>
                            {opt}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>
                    </div>

                    <div className="pt-1 flex justify-center">
                      <button
                        className="bg-[#7da0eb] hover:bg-[#6b8dd6] text-white px-10 py-2 rounded-md font-medium transition-colors"
                        //cuando el usuario le de click al boton se ejecuta la funcion agregarTarea
                        onClick={agregarTarea}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-[55%] bg-[#fcfcfc] p-8 md:p-16 flex flex-col">
            <div className="w-full max-w-3xl mx-auto h-full flex flex-col items-center">

              <img
                src="/logout.png"
                alt="Imagen de cerrar sesion"
                className="w-6 cursor-pointer absolute top-7 right-9"
                //cuando el usuario le de click al boton se ejecuta la funcion handleLogout
                onClick={handleLogout}
              />

              <h2 className="text-3xl text-black mb-10">Mis tareas</h2>

              {/* Filtro */}
              <div className="w-full max-w-[200px] self-start ml-8 md:ml-0">
                <Label htmlFor="name-1" className="m-2">Filtro estado</Label>
                <NativeSelect
                  //el input select va a tener como valor el estado filtroEstado
                  value={filtroEstado}
                  // a filtroEstado le pasamos el valor que se seleccione en el select
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  <NativeSelectOption value="">Todos</NativeSelectOption>
                  {/* recorremos el array de las opciones para mostrar las opciones */}
                  {opciones.map((opt) => (
                    <NativeSelectOption key={opt} value={opt}>
                      {opt}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>

              {/* Lista */}
              {/* si no hay tareas creadas */}
              {tareasFiltradas.length === 0 ? (
                <p className="text-gray-600 mt-15 text-2xl">
                  No hay tareas creadas
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 w-full px-8 md:px-0">
                  {/* si hay tareas, recorremos cada tarea */}
                  {tareasFiltradas.map((task) => (
                    <Card
                      className="w-full max-w-sm mt-5"
                      //llave unica
                      key={task.id}

                    >
                      <div className="text-center space-y-1 mb-2">
                        <h3 className="text-gray-800 font-medium">
                          {/* mostramos el nombre de cada tarea */}
                          {task.nombre_tarea}
                        </h3>
                        <p className="text-gray-600">
                          {/* mostramos el estado de cada tarea */}
                          {task.estado}
                        </p>
                      </div>

                      <div className="flex gap-4 w-full justify-center px-2">
                        <button
                          //cuando le damos click al boton eliminar se ejecuta la funcion deleteTarea y le pasamos el id de la tarea
                          onClick={() => deleteTarea(task.id)}
                          className="bg-[#f08b8b] hover:bg-[#e07a7a] text-white text-xs px-6 py-2 rounded-sm transition-colors"
                        >
                          Eliminar
                        </button>

                        <Button
                          variant="outline"
                          //cuando le damos click al boton modificar se ejecuta la funcion abrirModal y le pasamos todas las tareas
                          onClick={() => abrirModal(task)}
                        >
                          Modificar
                        </Button>
                      </div>
                    </Card>
                  ))}

                </div>
              )}

              {/* MODAL GLOBAL */}
              {/* si modal es true */}
              {modalEditando && (
                // si modalOpen es true el modal aparece en pantalla, modalOpen por defecto es false
                //si el usuario intenta cerrar el modal se ejcuta onOpenChange y automaticamente modalOpen pasa a false y se cierra el modal
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Editar tarea</DialogTitle>
                      <DialogDescription>
                        Realiza cambios en tu tarea aqui. Haz click en "Guardar" cuando hayas terminado
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="edit-name">Nombre tarea</Label>
                        <Input
                          id="edit-name"
                          //al input de modificar tarea le pasamos el valor de la nueva tarea
                          value={nuevoNombre}
                          //al estado de el nuevo nombre le pasamos el valor que escriba en el input
                          onChange={(e) => setNuevoNombre(e.target.value)}
                        />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="edit-status">Estado</Label>
                        <NativeSelect
                          //al select de modificar estado le pasamos el valor de el nuevo estado
                          value={nuevoEstado}
                          //al estado de el nuevo estado de la tarea le pasamos el valor seleccionado en el select
                          onChange={(e) => setNuevoEstado(e.target.value)}
                        >
                          {/* recorremos el array de las opciones */}
                          {opciones.map((opt) => (
                            <NativeSelectOption key={opt} value={opt}>
                              {opt}
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      {/* cuando le damos click al boton guardar se ejecuta la funcion updateTarea */}
                      <Button type="submit" onClick={updateTarea}>
                        Guardar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div >
    </>
  );
};
