import { Dialog } from "@material-tailwind/react";
import { useGlobalContext } from "../context/GlobalContext";
import { Link } from "react-router-dom";

export function Home() {
  const { handleOpen, activePopup, openPopup, session } = useGlobalContext();

  const openLoginForCategory = (category) => {
    handleOpen(null, category);
    openPopup("login"); // Asegura abrir el popup del login
  };

 

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="relative flex flex-col items-center py-16">
        <h2 className="text-black text-5xl font-extrabold mb-8 mt-6">
          Bienvenido a Las Zapas
        </h2>
        <p className="text-gray-700 text-lg mb-12 text-center max-w-2xl">
          Descubre nuestra colección de zapatillas para todas las ocasiones. ¡Encuentra tus favoritas ahora!
        </p>

        <div className="text-center flex flex-wrap justify-center items-center gap-8 max-w-7xl px-4">
          {/* Categoría: Hombres */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden group">
            <button className="w-full transition duration-300 hover:scale-105">
              <img
                onClick={() => handleOpen(null, "zapatoHombre")} // Pasamos null como item
                src="/3.png"
                alt="Hombres"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
            <Dialog
              size="xs"
              open={activePopup === "zapatoHombre"}
              handler={() => openPopup(null)} // Para cerrar el popup
              className="bg-transparent shadow-none"
            >
              <img src="/3.png" alt="zapatoHombre" className="w-full mb-4 rounded-md" />
            </Dialog>
            <div className="p-4">
              <h3 className="text-2xl font-bold mb-2">Hombres</h3>
              <p className="text-gray-600 mb-4">
                Estilo y comodidad en cada paso. Explora nuestra colección para hombres.
              </p>
                {!session && (
                              <>
                                <button
                                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                  onClick={() => openLoginForCategory("zapatoHombre")}
                                  >
                                    Ver Más
                                </button>
                              </>
                )}
                {session && (
                              <Link to="/hombre">
                                <button
                                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                  onClick={() => openLoginForCategory("zapatoHombre")}
                                >
                                  Ver Más
                                </button>
                              </Link>
                )}
            </div>
          </div>

          {/* Categoría: Mujeres */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden group">
            <button className="w-full transition duration-300 hover:scale-105">
              <img
                onClick={() => handleOpen(null, "zapatoMujer")} // Pasamos null como item
                src="/m1.png"
                alt="Mujeres"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
            <Dialog
              size="xs"
              open={activePopup === "zapatoMujer"}
              handler={() => openPopup(null)} // Para cerrar el popup
              className="bg-transparent shadow-none"
            >
              <img src="/m1.png" alt="zapatoMujer" className="w-full mb-4 rounded-md" />
            </Dialog>
            <div className="p-4">
              <h3 className="text-2xl font-bold mb-2">Mujeres</h3>
              <p className="text-gray-600 mb-4">
                Diseños elegantes para cualquier ocasión. Encuentra tu par ideal.
              </p>
                {!session && (
                              <>
                                <button
                                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                  onClick={() => openLoginForCategory("zapatoMujer")}
                                  >
                                    Ver Más
                                </button>
                              </>
                )}
                {session && (
                              <Link to="/mujer">
                                <button
                                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                  onClick={() => openLoginForCategory("zapatoMujer")}
                                >
                                  Ver Más
                                </button>
                              </Link>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
