import { useState } from "react";
import { Button } from "@material-tailwind/react";
import { useGlobalContext } from "../context/GlobalContext";
import { Login } from "./Login";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ImContrast } from "react-icons/im";
import { supabase } from "../bd/supabase";
import { LanguageToggleButton } from "./LanguageToggleButton";
import { useTranslation } from "react-i18next";

export const Header = () => {
  const { t } = useTranslation();
  const { isButtonDisabled, handleButtonClick, session, setSession, isAdmin, setIsAdmin, openPopup, logout } = useGlobalContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let navigate = useNavigate();
  const location = useLocation();

  function changeDarkMode() {
    document.documentElement.classList.toggle("dark");
  }

  async function handleLogout() {
    openPopup(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during logout:", error);
    } else {
      await logout();
      openPopup(null);
      setSession(null);
      setIsAdmin(false);
      navigate("/");
    }
  }
  
  function handleLoginClick() {
    setIsMenuOpen(false);
    handleButtonClick(() => openPopup("login"));
  }

  const menuRoutes = [
    { path: "/hombre", label: t('Hombre') },
    { path: "/mujer", label: t('Mujer') },
  ];

  return (
    <header className="bg-gray-900 text-white p-4 shadow-md fixed left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          <Link to="/">Las Zapas</Link>
        </h1>
        {session?.user?.user_metadata && (
          <p className="hidden md:block text-sm md:text-base lg:text-lg flex-1 text-center font-semibold">{t('Bienvenido')} {session.user.user_metadata.name}</p>
        )}

        {/* Menú para pantallas grandes */}
        <nav className="hidden md:flex items-center space-x-4">
          {!session && <Login />}
          {session && menuRoutes.map(item => 
            location.pathname !== item.path && (
              <Link key={item.path} to={item.path} className="hover:text-gray-400 font-semibold text-sm lg:text-base transition hover:scale-105">{item.label}</Link>
            )
          )}
          {session && (
            <Link to="/perfil" className="hover:text-gray-400 font-semibold text-sm lg:text-base transition hover:scale-105">{t('Perfil')}</Link>
          )}
          {isAdmin && (
            <>
              <Link to="/usuarios" className="hover:text-gray-400 font-semibold text-sm lg:text-base transition hover:scale-105">{t('Usuarios')}</Link>
              <Link to="/devoluciones" className="hover:text-gray-400 font-semibold text-sm lg:text-base transition hover:scale-105">{t('Devoluciones')}</Link>
            </>
          )}
          {session && <Button onClick={handleLogout}>{t('Cerrar Sesión')}</Button>}
          <button onClick={changeDarkMode} className="h-7 w-7 bg-white dark:bg-blue-gray-800 rounded shadow-lg transition hover:scale-105">
            <ImContrast className="w-full dark:text-white text-blue-gray-800" />
          </button>
          <LanguageToggleButton />
        </nav>

        {/* Botón hamburguesa */}
        <button className="md:hidden focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <nav className="md:hidden bg-gray-800 text-white text-center p-4 mt-2 rounded-lg">
          <ul className="space-y-2">
            {session?.user?.user_metadata && <li className="hover:text-gray-400">{t('Bienvenido')} {session.user.user_metadata.name}</li>}
            {!session && <li><Button disabled={isButtonDisabled} onClick={handleLoginClick}>Login</Button></li>}
            {session && menuRoutes.map(item => location.pathname !== item.path && (
              <li key={item.path} className="hover:text-gray-400">
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
            {isAdmin && <li><Link to="/usuarios" className="hover:text-gray-400">{t('Usuarios')}</Link></li>}
            {isAdmin && <li><Link to="/devoluciones" className="hover:text-gray-400">{t('Devoluciones')}</Link></li>}
            {session && <li><Button onClick={handleLogout}>Logout</Button></li>}
            <li><button onClick={changeDarkMode} className="h-7 w-7 bg-white dark:bg-blue-gray-800 rounded shadow-lg transition hover:scale-105"><ImContrast className="w-full dark:text-white text-blue-gray-800" /></button></li>
            <li><LanguageToggleButton /></li>
          </ul>
        </nav>
      )}
    </header>
  );
};
