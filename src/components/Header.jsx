import { useState } from "react";
import { Button } from "@material-tailwind/react";
import { useGlobalContext } from "../context/GlobalContext";
import { Login } from "./Login";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../bd/supabase";
import { ImContrast } from "react-icons/im";
// import { LanguageToggleButton } from "./LanguageToggleButton";

export const Header = () => {
  const { session, setSession, isAdmin, setIsAdmin } = useGlobalContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para abrir/cerrar el menú móvil
  let navigate = useNavigate();

  function changeDarkMode() {
    document.documentElement.classList.toggle("dark");
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during logout:", error);
    } else {
      setSession(null);
      setIsAdmin(false);
      navigate("/");
    }
  }

  return (
    <header className="bg-gray-900 text-white p-4 shadow-md fixed left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl sm:text-3xl font-bold">
          <Link to="/">Las Zapas</Link>
        </h1>

        {/* Menú para pantallas grandes */}
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
          <button
              onClick={changeDarkMode}
              className="h-7 w-7 bg-white dark:bg-blue-gray-800 rounded-md shadow-lg"
              aria-hidden="true"
            >
              <ImContrast className='w-full dark:text-white text-blue-gray-800' />
            </button>
            {session && session.user && session.user.user_metadata && (
              <li className="hover:text-gray-400">Bienvenido {session.user.user_metadata.name}</li>
            )}
            {!session && (
              <li className="hover:text-gray-400">
                <Login />
              </li>
            )}
            {session && (
              <>
                <li className="hover:text-gray-400">
                  <Link to="/hombre">Hombre</Link>
                </li>
                <li className="hover:text-gray-400">
                  <Link to="/mujer">Mujer</Link>
                </li>
              </>
            )}
            {isAdmin && (
              <li>
                <Link
                  to="/usuarios"
                  className="text-white dark:text-blue-gray-800 dark:hover:text-blue-gray-400 hover:text-blue-gray-400 hover:scale-x-105 hover:scale-y-105 transition duration-150 shadow-lg hover:shadow-xl hover:shadow-white/50 shadow-white/50 dark:hover:shadow-blue-gray-800/50 dark:shadow-blue-gray-800/50"
                >
                  Usuarios
                </Link>
              </li>
            )}
            {session && (
              <li>
                <Button onClick={handleLogout}>Logout</Button>
              </li>
            )}
          </ul>
        </nav>

        {/* Botón del menú hamburguesa para pantallas pequeñas */}
        <button
          className="block md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Menú desplegable para pantallas pequeñas */}
      {isMenuOpen && (
        <nav className="md:hidden bg-gray-800 text-white p-4 mt-2 rounded-lg">
          <ul className="space-y-2">
            {session && session.user && session.user.user_metadata && (
              <li className="hover:text-gray-400">Bienvenido {session.user.user_metadata.name}</li>
            )}
            {!session && (
              <li className="hover:text-gray-400">
                <Login />
              </li>
            )}
            {session && (
              <>
                <li className="hover:text-gray-400">
                  <Link to="/hombre">Hombre</Link>
                </li>
                <li className="hover:text-gray-400">
                  <Link to="/mujer">Mujer</Link>
                </li>
              </>
            )}
            {isAdmin && (
              <li>
                <Link
                  to="/usuarios"
                  className="text-white dark:text-blue-gray-800 dark:hover:text-blue-gray-400 hover:text-blue-gray-400 hover:scale-x-105 hover:scale-y-105 transition duration-150 shadow-lg hover:shadow-xl hover:shadow-white/50 shadow-white/50 dark:hover:shadow-blue-gray-800/50 dark:shadow-blue-gray-800/50"
                >
                  Usuarios
                </Link>
              </li>
            )}
            {session && (
              <li>
                <Button onClick={handleLogout}>Logout</Button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};
