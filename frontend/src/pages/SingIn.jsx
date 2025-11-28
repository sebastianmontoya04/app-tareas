import { Link } from 'react-router-dom'

export const SingIn = () => {

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

          <form className="space-y-8" >
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
