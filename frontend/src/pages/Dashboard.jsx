import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api";
import { jwtDecode } from "jwt-decode";

export const Dashboard = () => {
  const [nombreTarea, setNombreTarea] = useState("");
  const [estado, setEstado] = useState("");
  const [mostrarTasks, setMostrarTasks] = useState([]);

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
      setMostrarTasks(res.data.tareas || [])
    } catch (error) {
      console.log("Error al mostrar las tareas");
      setMostrarTasks([]);
    }
  };

  const agregarTarea = async () => {
    if (!nombreTarea || !estado) return;

    try {
      const res = await axios.post(`${API_URL}/auth/crearTarea`, {
        nombre_tarea: nombreTarea,
        estado,
      });

      setMostrarTasks(tareaVieja => [...tareaVieja, res.data.tarea])

      setNombreTarea("");
      setEstado("");
    } catch (error) {
      console.log("Error al crear la tarea");
    }
  };

  const eliminarTarea = async (id) => {
    try {
      await axios.delete(`${API_URL}/auth/eliminarTarea/${id}`);
      setMostrarTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.log("Error al eliminar la tarea");
    }
  };

  const abrirModal = (task) => {
    setModalEditando(task);
    setNuevoNombre(task.nombre_tarea);
    setNuevoEstado(task.estado);
    setModalOpen(true);
  };

  const modificarTarea = async () => {
    try {
      await axios.put(`${API_URL}/auth/actualizarTarea/${modalEditando.id}`,
        {
          nombre_tarea: nuevoNombre,
          estado: nuevoEstado,
        }
      );

      setMostrarTasks(prev => prev.map(tarea => 
        tarea.id === modalEditando.id 
        ? {...tarea,
          Nuevo_nombre_tarea: nuevoNombre,
          nuevo_estado: nuevoEstado
        }
        : tarea
      ))

      setModalOpen(false);
      setModalEditando(null);
      mostrarTareas();
    } catch (error) {
      console.log("Error al modificar la tarea");
    }
  };

  const tareasFiltradas = filtroEstado
    ? mostrarTasks.filter(task => task.estado === filtroEstado)
    : mostrarTasks;

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
                <p className="text-xl opacity-90 font-light text-white/90">
                  {nombre}
                </p>

                <p className="text-xl mt-8 leading-snug max-w-[300px] mx-auto pt-4">
                  Esta app te permitira organizar tus tareas de forma eficiente y ordenada
                </p>
              </div>

              {/* Add Task */}
              <div className="bg-white rounded-none p-8 mt-12 text-gray-800 max-w-[350px] w-full shadow-none">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600 pl-1">
                      Nombre tarea
                    </label>
                    <input
                      type="text"
                      placeholder="Ingresa tu tarea"
                      className="w-full bg-[#d1d1d1] border-none rounded-sm p-3 text-gray-700 placeholder:text-gray-600 focus:outline-none"
                      value={nombreTarea}
                      onChange={(e) => setNombreTarea(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <div className="relative w-full bg-[#d1d1d1] rounded-sm flex items-center h-\[48px]">

                      <select
                        className="w-full bg-transparent border-none h-full py-3 text-gray-700 focus:outline-none cursor-pointer pl-1"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                      >
                        <option value="" disabled>
                          Estado
                        </option>
                        {opciones.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-center">
                    <button
                      className="bg-[#7da0eb] hover:bg-[#6b8dd6] text-white px-10 py-2 rounded-md font-medium transition-colors"
                      onClick={agregarTarea}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-[55%] bg-[#fcfcfc] p-8 md:p-16 flex flex-col">
            <div className="w-full max-w-3xl mx-auto h-full flex flex-col items-center">
              <h2 className="text-3xl text-black mb-10">Mis tareas</h2>
              <div className="w-full max-w-[200px] self-start ml-8 md:ml-0">
                <label className="block text-sm text-gray-600 mb-1 pl-1">Filtro de busqueda</label>
                <div className="relative w-full bg-[#e0e0e0] rounded-sm flex items-center h-10">

                  <select className="w-full bg-transparent border-none h-full text-gray-700 focus:outline-none cursor-pointer pl-2"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}>
                    <option value="">Todas</option>
                    {opciones.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>


              {tareasFiltradas.length === 0 ? (
                <p className="text-gray-600">No hay tareas creadas</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 w-full px-8 md:px-0">
                  {tareasFiltradas.map((task) => (
                    <div
                      key={task.id}
                      className="bg-[#e0e0e0] p-6 py-8 flex flex-col items-center justify-center gap-4 shadow-none min-w-[200px] mt-7"
                    >
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
                        <button
                          onClick={() => abrirModal(task)}
                          className="bg-[#8b8bf0] hover:bg-[#7a7ae0] text-white text-xs px-6 py-2 rounded-sm transition-colors"
                        >
                          Modificar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MODAL */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white p-6 w-[300px]">
                <h3 className="text-lg font-semibold mb-4">
                  Editar tarea
                </h3>

                <input
                  className="w-full bg-gray-200 p-2 mb-3"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                />

                <select
                  className="w-full bg-gray-200 p-2 mb-4"
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                >
                  {opciones.map((op) => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>

                <div className="flex justify-between">
                  <button onClick={() => setModalOpen(false)} className="bg-[#f08b8b] px-6 py-1">
                    Cancelar
                  </button>

                  <button onClick={modificarTarea} className="bg-[#8b8bf0] px-6 py-1" >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
