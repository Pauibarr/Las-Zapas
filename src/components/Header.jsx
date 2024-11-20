import { Button } from "@material-tailwind/react";
import { useGlobalContext } from "../context/GlobalContext";
import { Login } from "./Login";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../bd/supabase";

export const Header = () => {

  const { session, setSession, isAdmin, setIsAdmin } = useGlobalContext();
  let navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during logout:', error);
    } else {
      setSession(null);
      setIsAdmin(false);
      navigate('/');
    }
  }

    return (
        <header className="bg-gray-900 text-white p-4 shadow-md fixed left-0 right-0 py-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold"><Link to="/">Las Zapas</Link></h1>
            <nav>
              <ul className="flex space-x-4">
                {session && session.user && session.user.user_metadata && (
                  <li className="hover:text-gray-400">    
                    Bienvenido {session.user.user_metadata.name}
                  </li>
                )}
                {!session &&(
                  <li className="hover:text-gray-400">    
                    <Login/>
                  </li>
                )}
                {session &&(
                  <li className="hover:text-gray-400">
                    <Link to="/hombre">Hombre</Link>
                  </li>
                )}
                {session &&(
                  <li className="hover:text-gray-400">
                    <Link to="/mujer">Mujer</Link>
                  </li>
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
                  <li><Button onClick={handleLogout}>Logout</Button></li>
                )}
              </ul>
            </nav>
          </div>
        </header>
      );
    };