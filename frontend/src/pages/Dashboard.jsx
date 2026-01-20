import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
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
  const [mostrarTasks, setMostrarTasks] = useState([]);
  //opciones de estado de las tareas que tambien las utilizamos para el filtro de busqueda
  const opciones = ["Realizado", "Pendiente", "En proceso"];

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

  // ===== CRUD =====
  const mostrarTareas = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/mostrarTareas`);
      //guardamos las tareas en el estado de mostrarTask
      setMostrarTasks(res.data.tareas || [])
    } catch (error) {
      console.log("Error al mostrar las tareas");
      setMostrarTasks([]);
    }
  };

  const agregarTarea = async () => {
    //condicional por si el usuario no ingresa el nombre de la tarea ni selecciona el estado
    if (!nombreTarea || !estado) return;

    try {
      //llamamos el endpoint de el backend que espera recibir nombre de la tarea y el estado
      const res = await axios.post(`${API_URL}/auth/crearTarea`, {
        //aqui enviamos el nombre de la tarea y el estado
        nombre_tarea: nombreTarea,
        estado,
      });
      //seteamos el estado donde van las tareas con el operador spread asi tomamos las tareas ya creadas y le agregamos las nuevas tareas
      setMostrarTasks(tareaVieja => [...tareaVieja, res.data.tarea])
      //vaciamos el input de nombre tarea y el de estado
      setNombreTarea("");
      setEstado("");
    } catch (error) {
      console.log("Error al crear la tarea");
    }
  };
  //recibimos como parametro el id de la tarea para poder saber que tarea eliminamos
  const eliminarTarea = async (id) => {
    try {
      //solicitamos el endpoint de el backend
      await axios.delete(`${API_URL}/auth/eliminarTarea/${id}`);

      //cambiamos el estado de las tareas, con el metodo filter prev trae las tareas viejas despues filter recorre todas las tareas y solo deja me retorna las tareas difrentes al id de la tarea que quiero eliminar
      setMostrarTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.log("Error al eliminar la tarea");
    }
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

  const modificarTarea = async () => {
    try {
      //solicitamos el endpoint y sacamos el id de la tarea desde modal editando que ya trae todas las tareas
      await axios.put(`${API_URL}/auth/actualizarTarea/${modalEditando.id}`,
        //enviamos la nueva tarea con su estado 
        {
          nombre_tarea: nuevoNombre,
          estado: nuevoEstado,
        }
      );
      //al estado que tiene todas las tareas le pasamos las tareas viejas, recorremos esas tareas con .map y si el id de la tarea es igual al id de la tarea que queremos editar entonces copiamos la informacion de la tarea y lo remplazamos por la nueva informacion de la tarea, dado el caso que el id no sea igual le mandamos la tarea que estaba desde el principio 
      setMostrarTasks(prev => prev.map(tarea =>
        tarea.id === modalEditando.id
          ? {
            ...tarea,
            nombre_tarea: nuevoNombre,
            estado: nuevoEstado
          }
          : tarea
      ))
      //cerramos el modal
      setModalOpen(false);
    } catch (error) {
      console.log("Error al modificar la tarea");
    }
  };
  //filtro de tareas: si filtroEstado trae el estado de la tarea entonces recorremos mostrarTask que trae todas las tareas con filter y mostramos solo las tareas con el estado que espera filtroEstado, sea pendiente, en proceso o realizado, si filtroEstado no trae ninguna estado de la tarea entonces mostramos todas las tareas
  const tareasFiltradas = filtroEstado
    ? mostrarTasks.filter(task => task.estado === filtroEstado)
    : mostrarTasks;

  const handleLogout = () => {

    localStorage.removeItem('token');

    navigate('/Login', { replace: true });
  }

  //al momento de iniciar la pagina renderizamos mostrarTareas qu enos trae todas las tareas creadas
  useEffect(() => {
    mostrarTareas();
  }, []);

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
                        value={nombreTarea}
                        onChange={(e) => setNombreTarea(e.target.value)} />
                    </div>

                    <div className="space-y-2 relative">
                      <Label htmlFor="username-1">Estado</Label>
                      {/* <div className="relative w-full bg-[#d1d1d1] rounded-sm flex items-center h-\[48px]"> */}

                      <NativeSelect
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                      >
                        {opciones.map(opt => (
                          <NativeSelectOption key={opt} value={opt}>
                            {opt}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>

                      {/* </div> */}
                    </div>

                    <div className="pt-1 flex justify-center">
                      <button
                        className="bg-[#7da0eb] hover:bg-[#6b8dd6] text-white px-10 py-2 rounded-md font-medium transition-colors"
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
              <img src="/logout.png" alt="Imagen de cerrar sesion" className="w-6 cursor-pointer absolute top-7 right-9"
                onClick={handleLogout} />
              <h2 className="text-3xl text-black mb-10">Mis tareas</h2>
              <div className="w-full max-w-[200px] self-start ml-8 md:ml-0">
                <option value="" disabled>
                  Filtro estado
                </option>
                <NativeSelect
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}>
                  <NativeSelectOption value="">Todos</NativeSelectOption>
                  {opciones.map((opt) => (
                    <NativeSelectOption key={opt} value={opt}>{opt}</NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>


              {tareasFiltradas.length === 0 ? (
                <p className="text-gray-600 mt-15 text-2xl">No hay tareas creadas</p>
              ) : (

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 w-full px-8 md:px-0">
                  {tareasFiltradas.map((task) => (
                    <Card className="w-full max-w-sm mt-5"
                      key={task.id}>
                      <div className="text-center space-y-1 mb-2">
                        <h3 className="text-gray-800 font-medium">
                          {task.nombre_tarea}
                        </h3>
                        <p className="text-gray-600">{task.estado}</p>
                      </div>

                      <div className="flex gap-4 w-full justify-center px-2">
                        <button
                          onClick={() => eliminarTarea(task.id)}
                          className="bg-[#f08b8b] hover:bg-[#e07a7a] text-white text-xs px-6 py-2 rounded-sm transition-colors"
                        >
                          Eliminar
                        </button>
                        <Dialog open={modalOpen} onOpenChange={setModalOpen}>

                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => abrirModal(task)}>Modificar</Button>
                          </DialogTrigger>

                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Editar tarea</DialogTitle>
                              <DialogDescription>
                                Realiza cambios en tu tarea aqui. Haz click en "Guardar" cuando hayas terminado
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                              <div className="grid gap-3">
                                <Label htmlFor="name-1">Nombre tarea</Label>
                                <Input
                                  id="name-1"
                                  name="name"
                                  defaultValue={task.nombre_tarea}
                                  value={nuevoNombre}
                                  onChange={(e) => setNuevoNombre(e.target.value)} />
                              </div>
                              <div className="grid gap-3">
                                <Label htmlFor="username-1">Estado</Label>
                                <NativeSelect
                                  value={nuevoEstado}
                                  onChange={(e) => setNuevoEstado(e.target.value)}
                                >
                                  {opciones.map(opt => (
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
                              <Button
                                type="submit"
                                onClick={modificarTarea}>Guardar</Button>
                            </DialogFooter>
                          </DialogContent>

                        </Dialog>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div >
    </>
  );
};
