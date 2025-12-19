import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import { useState } from "react";
import { API_URL } from '../api'
import Swal from 'sweetalert2'

export const Login = () => {
  const navigate = useNavigate();
  const [nombre_usuario, setNombre_usuario] = useState([]);
  const [password, setPassword] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        nombre_usuario: nombre_usuario.trim(),
        password: password.trim()
      });

      localStorage.setItem("token", response.data.token);

      Swal.fire({
        icon: 'success',
        title: '¡Inicio de sesión exitoso!',
      });

      navigate('/Dashboard');

    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.msg

      if (status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: message
        });
      } else if (status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: message
        });
      } else if (status === 402) {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: message
        });
      } else if (status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: message
        });
      } else if (status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: message
        });
      }
    }
  };


  return <>
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans">
      {/* Panel izquierdo */}
      <div className="w-full md:w-[45%] bg-[#f9f9f9] flex flex-col justify-center items-center p-8 md:p-16 relative">
        <div className="text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-normal text-black tracking-wide mb-2">
            App de
          </h1>
          <h1 className="text-7xl md:text-9xl font-medium text-black tracking-tight">
            Tareas
          </h1>
        </div>

        <div className="mt-16 md:mt-24 text-center space-y-1">
          <p className="text-gray-900 text-lg font-medium">No tienes una cuenta?</p>
          <Link to="/SingIn" className="text-[#5887d4] text-xl mt-2 font-medium hover:underline block">
            Registrarse
          </Link>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="w-full md:w-[55%] bg-[#769cd8] flex items-center justify-center p-4 md:p-8">
        <div className="bg-white w-full max-w-[450px] p-10 md:p-14 shadow-2xl">
          <h2 className="text-[#5887d4] text-3xl font-medium text-center mb-12">
            Iniciar sesion
          </h2>

          <form className="space-y-8" onSubmit={handleLogin}>
            <div className="space-y-3">
              <label className="text-gray-700 text-sm font-medium ml-1">
                Nombre de usuario
              </label>
              <div className="relative group">
                <input
                  type="text"
                  className="w-full bg-[#eeeeee] text-gray-900 pl-5 pr-4 py-3.5 rounded-xl border-none focus:ring-2 focus:ring-[#5887d4]/50 focus:outline-none transition-all shadow-[0_2px_5px_rgba(0,0,0,0.05)]"
                  data-testid="input-username"
                  placeholder="Ingresa tu nombre de usuario"
                  value={nombre_usuario}
                  onChange={(e) => setNombre_usuario(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-gray-700 text-sm font-medium ml-1">
                Contraseña
              </label>
              <div className="relative group">
                <input
                  type="password"
                  className="w-full bg-[#eeeeee] text-gray-900 pl-5 pr-4 py-3.5 rounded-xl border-none focus:ring-2 focus:ring-[#5887d4]/50 focus:outline-none transition-all shadow-[0_2px_5px_rgba(0,0,0,0.05)]"
                  data-testid="input-password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-6 flex justify-center">
              <button
                className="bg-[#769cd8] hover:bg-[#648bc7] text-white px-10 py-2.5 rounded-sm transition-colors shadow-sm text-lg font-normal"
                data-testid="button-submit"
              >
                Confirmar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
};
