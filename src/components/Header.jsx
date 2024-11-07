import { Login } from "./Login";
import { Link } from "react-router-dom";

export const Header = () => {

    return (
        <header className="bg-gray-900 text-white p-4 shadow-md fixed left-0 right-0 py-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold"><Link to="/">Las Zapas</Link></h1>
            <nav>
              <ul className="flex space-x-4">
                <li className="hover:text-gray-400">    
                  <Login/>
                </li>
                <li className="hover:text-gray-400">
                  <Link to="/hombre">Hombre</Link>
                </li>
                <li className="hover:text-gray-400">
                  <Link to="/mujer">Mujer</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      );
    };