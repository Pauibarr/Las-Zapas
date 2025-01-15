import { Dialog } from "@material-tailwind/react";
import { useGlobalContext } from "../context/GlobalContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export function Mujer() {
  const { fetchTableData, zapatosMujer, setZapatosMujer, zapatillasMujer, setZapatillasMujer, botasMujer, setBotasMujer, handleOpen, activePopup, openPopup } = useGlobalContext();

  const openLoginForCategory = (category) => {
    handleOpen(null, category);
    openPopup("login");
  };

  useEffect(() => {
        const fetchZapatos = async () => {
            const data = await fetchTableData("ZapatosDeVestirMujer");
            setZapatosMujer(data);
        };
        fetchZapatos();
        
        const fetchZapatillas = async () => {
          const data = await fetchTableData("ZapatillasMujer");
          setZapatosMujer(data);
      };
      fetchZapatillas();

      const fetchBotas = async () => {
        const data = await fetchTableData("BotasYBotinesMujer");
        setZapatosMujer(data);
    };
    fetchBotas();

  }, [fetchTableData]);
  



  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="relative flex flex-col items-center py-16">
        <h2 className="text-black text-5xl font-extrabold mb-8 mt-6">
          Zapatos para Mujeres
        </h2>
        <p className="text-gray-700 text-lg mb-12 text-center max-w-2xl">
          Explora nuestra colección exclusiva para mujeres: Botas, Zapatillas y Zapatos de vestir.
        </p>

        <div className="text-center flex flex-wrap justify-center items-center gap-8 max-w-7xl px-4">
          {/* Botas */}
        {botasMujer.map((Bota) => (
          <div key={Bota.id} className="bg-white shadow-lg rounded-lg overflow-hidden group">
            <button className="w-full transition duration-300 hover:scale-105">
              <img
                onClick={() => handleOpen(null, "botasMujer")}
                src="/botasMujer.png" // Cambia por la imagen correspondiente
                alt="Botas"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
            <Dialog
              size="xs"
              open={activePopup === "botasMujer"}
              handler={() => openPopup(null)}
              className="bg-transparent shadow-none"
            >
              <img src="/botasMujer.png" alt="Botas" className="w-full mb-4 rounded-md" />
            </Dialog>
            <div className="p-4">
              <h3 className="text-2xl font-bold mb-2">Botas</h3>
              <p className="text-gray-600 mb-4">Duraderas y con estilo para cualquier ocasión.</p>
              <Link to="/botasMujer">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => openLoginForCategory("botasMujer")}
                >
                  Ver Más
                </button>
              </Link>
            </div>
          </div>
        ))}
          {/* Zapatillas */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden group">
            <button className="w-full transition duration-300 hover:scale-105">
              <img
                onClick={() => handleOpen(null, "zapatillasMujer")}
                src="/zapatillasMujer.png"
                alt="Zapatillas"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
            <Dialog
              size="xs"
              open={activePopup === "zapatillasMujer"}
              handler={() => openPopup(null)}
              className="bg-transparent shadow-none"
            >
              <img src="/zapatillasMujer.png" alt="Zapatillas" className="w-full mb-4 rounded-md" />
            </Dialog>
            <div className="p-4">
              <h3 className="text-2xl font-bold mb-2">Zapatillas</h3>
              <p className="text-gray-600 mb-4">Comodidad y estilo para tu día a día.</p>
              <Link to="/zapatillasMujer">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => openLoginForCategory("zapatillasMujer")}
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
                onClick={() => handleOpen(null, "vestirMujer")}
                src="/vestirMujer.png"
                alt="Zapatos de vestir"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
            <Dialog
              size="xs"
              open={activePopup === "vestirMujer"}
              handler={() => openPopup(null)}
              className="bg-transparent shadow-none"
            >
              <img src="/vestirMujer.png" alt="Zapatos de vestir" className="w-full mb-4 rounded-md" />
            </Dialog>
            <div className="p-4">
              <h3 className="text-2xl font-bold mb-2">Zapatos de vestir</h3>
              <p className="text-gray-600 mb-4">Elegancia para ocasiones especiales.</p>
              <Link to="/zapatosMujer">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => openLoginForCategory("vestirMujer")}
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