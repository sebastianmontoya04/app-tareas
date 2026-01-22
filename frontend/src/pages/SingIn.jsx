//importaciones
import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../api';
import Swal from 'sweetalert2';

export const SingIn = () => {
  //estados de nombre y contraseña de usuario
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [contraseña, setContraseña] = useState('')

  //funcion que se ejecuta al momento de mandar el formulario
  const handleRegister = async (e) => {
    //evita que la pagina se recargue
    e.preventDefault();
    if (!nombreUsuario.trim() || !contraseña.trim()) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }
    try {
      //lamado al endpoint del backend que me espera como parametros nombre usuarios y password
      await axios.post(`${API_URL}/auth/registrar`, {
        //le pasamos el estado de nombreUsuario y contraseña
        nombre_usuarios: nombreUsuario.trim(),
        password: contraseña.trim()
      })
      Swal.fire({
        icon: 'success',
        title: 'Usuario registrado correctamente'
      });
      //al momento de enviar los datos resetiamos los inputs
      setNombreUsuario('')
      setContraseña('')
    } catch (error) {
      Swal.fire(
        'Error',
        error.response?.data?.msg || 'Error al crear el usuario',
        'error'
      );

    }

  }

  return <>
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans">
      {/* Panel izquierdo */}
      <div className="w-full md:w-[45%] bg-[#f9f9f9] flex flex-col justify-center items-center p-8 md:p-16 relative">
        <div className="text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-normal text-black tracking-wide mb-2">
            Inicia Sesion
          </h1>
          <h1 className="text-7xl md:text-9xl font-medium text-black tracking-tight">
            Aqui
          </h1>
          <Link to="/Login" className="text-[#5887d4] text-xl mt-14 font-medium hover:underline block">
            Iniciar Sesion
          </Link>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="w-full md:w-[55%] bg-[#769cd8] flex items-center justify-center p-4 md:p-8">
        <div className="bg-white w-full max-w-[450px] p-10 md:p-14 shadow-2xl">
          <h2 className="text-[#5887d4] text-3xl font-medium text-center mb-12">
            Registrarse
          </h2>
          {/* cuando se envia el formulario se ejecuta la funcion handleRegister */}
          <form className="space-y-8" onSubmit={handleRegister} >
            <div className="space-y-3">
              <label className="text-gray-700 text-sm font-medium ml-1">
                Nombre de usuario
              </label>
              <div className="relative group">
                <input
                  type="text"
                  className="w-full bg-[#eeeeee] text-gray-900 pl-5 pr-4 py-3.5 rounded-xl border-none focus:ring-2 focus:ring-[#5887d4]/50 focus:outline-none transition-all shadow-[0_2px_5px_rgba(0,0,0,0.05)]"
                  data-testid="input-username"
                  placeholder='Ingresa tu nombre de usuario'
                  //al input de nombre usuario le pasamos como valor el estado nombreUsuario
                  value={nombreUsuario}
                  //al estado nombreUsuario le pasamos todo lo que el usuario ingrese en el input
                  onChange={(e) => setNombreUsuario(e.target.value)}
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
                  placeholder='Ingresa tu contraseña'
                  //al input de contraseña  le pasamos como valor el estado contraseña
                  value={contraseña}
                  //al estado contraseña le pasamos todo lo que el usuario ingrese en el input
                  onChange={(e) => setContraseña(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-6 flex justify-center">
              <button
                className="bg-[#769cd8] hover:bg-[#648bc7] text-white px-10 py-2.5 rounded-sm transition-colors shadow-sm text-lg font-normal"
                data-testid="button-submit"
              >
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
}
