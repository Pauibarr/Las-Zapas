import { Dialog } from "@material-tailwind/react";
import { useGlobalContext } from "../context/GlobalContext";
import { Link } from "react-router-dom";

export function Hombre() {
  const { handleOpen, activePopup, openPopup, session } = useGlobalContext();

  const openLoginForCategory = (category) => {
    handleOpen(null, category);
    openPopup("login");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="relative flex flex-col items-center py-16">
        <h2 className="text-black text-5xl font-extrabold mb-8 mt-6">
          Zapatos para Hombres
        </h2>
        <p className="text-gray-700 text-lg mb-12 text-center max-w-2xl">
          Explora nuestra colección exclusiva para hombres: Botas, Zapatillas y Zapatos de vestir.
        </p>

        <div className="text-center flex flex-wrap justify-center items-center gap-8 max-w-7xl px-4">
          {/* Botas */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden group">
            <button className="w-full transition duration-300 hover:scale-105">
              <img
                onClick={() => handleOpen(null, "botasHombre")}
                src="/botas.png" // Cambia por la imagen correspondiente
                alt="Botas"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
            <Dialog
              size="xs"
              open={activePopup === "botasHombre"}
              handler={() => openPopup(null)}
              className="bg-transparent shadow-none"
            >
              <img src="/botas.png" alt="Botas" className="w-full mb-4 rounded-md" />
            </Dialog>
            <div className="p-4">
              <h3 className="text-2xl font-bold mb-2">Botas</h3>
              <p className="text-gray-600 mb-4">Duraderas y con estilo para cualquier ocasión.</p>
              <Link to="/botasHombre">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => openLoginForCategory("botasHombre")}
                >
                  Ver Más
                </button>
              </Link>
            </div>
          </div>

          {/* Zapatillas */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden group">
            <button className="w-full transition duration-300 hover:scale-105">
              <img
                onClick={() => handleOpen(null, "zapatillasHombre")}
                src="/zapatillas.png"
                alt="Zapatillas"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
            <Dialog
              size="xs"
              open={activePopup === "zapatillasHombre"}
              handler={() => openPopup(null)}
              className="bg-transparent shadow-none"
            >
              <img src="/zapatillas.png" alt="Zapatillas" className="w-full mb-4 rounded-md" />
            </Dialog>
            <div className="p-4">
              <h3 className="text-2xl font-bold mb-2">Zapatillas</h3>
              <p className="text-gray-600 mb-4">Comodidad y estilo para tu día a día.</p>
              <Link to="/zapatillasHombre">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => openLoginForCategory("botasHombre")}
                >
                  Ver Más
                </button>
              </Link>
            </div>
          </div>

          {/* Zapatos de vestir */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden group">
            <button className="w-full transition duration-300 hover:scale-105">
              <img
                onClick={() => handleOpen(null, "vestirHombre")}
                src="/vestir.png"
                alt="Zapatos de vestir"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
            <Dialog
              size="xs"
              open={activePopup === "vestirHombre"}
              handler={() => openPopup(null)}
              className="bg-transparent shadow-none"
            >
              <img src="/vestir.png" alt="Zapatos de vestir" className="w-full mb-4 rounded-md" />
            </Dialog>
            <div className="p-4">
              <h3 className="text-2xl font-bold mb-2">Zapatos de vestir</h3>
              <p className="text-gray-600 mb-4">Elegancia para ocasiones especiales.</p>
              <Link to="/zapatosHombre">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => openLoginForCategory("botasHombre")}
                >
                  Ver Más
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}