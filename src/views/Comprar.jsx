import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  Button,
  Typography,
  Card,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { supabase } from "../bd/supabase";

export function Comprar() {
  const { tableName, nombre } = useParams();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedTallas, setSelectedTallas] = useState([]); // Tallas seleccionadas
  const [isTallasMenuOpen, setIsTallasMenuOpen] = useState(false);

  // Ref para detectar clics fuera del menú
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq("nombre", nombre)
          .single();

        if (error) throw error;
        setItem(data);
      } catch (err) {
        setError("No se pudo cargar el elemento. Inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [tableName, nombre]);

  const tallas = [37, 38, 39, 40, 41, 42, 43, 44, 45];

  // Manejar clics fuera del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsTallasMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Manejar selección de tallas
  const handleSelectTalla = (talla) => {
    if (selectedTallas.includes(talla)) {
      setSelectedTallas(selectedTallas.filter((t) => t !== talla));
    } else {
      setSelectedTallas([...selectedTallas, talla]);
    }
  };

  const totalPrecio = selectedTallas.length * (parseFloat(item?.precio) || 0);

  if (loading) {
    return <div className="text-center py-20">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  return (
    <>
      <Card className="container mx-auto py-20 px-4">
        <CardBody className="flex flex-col md:flex-row gap-8 items-start">
          <CardBody className="w-full md:w-1/2">
            <img
              src={item.imagen || "https://via.placeholder.com/300"}
              alt={item.nombre}
              className="w-full h-auto rounded-lg shadow-md cursor-pointer"
              onClick={() => setPopupOpen(true)}
            />
            <Dialog
              open={popupOpen}
              handler={() => setPopupOpen(false)}
              className="bg-transparent shadow-none"
            >
              <img
                src={item.imagen}
                alt={item.nombre}
                className="w-full h-auto rounded-md"
              />
            </Dialog>
          </CardBody>

          <CardBody className="w-full md:w-1/2">
            <Typography variant="h2" className="font-bold text-blue-gray-800 mb-4">
              {item.nombre}
            </Typography>
            <Typography variant="lead" className="text-blue-gray-600 mb-4">
              {item.descripcion}
            </Typography>
            <Typography className="text-xl font-semibold text-blue-gray-800 mb-4">
              Selecciona las tallas:
            </Typography>

            <div ref={menuRef} className="relative w-full group">
              <label className="text-xs text-gray-400">Selecciona Tallas</label>
              <button
                onClick={() => setIsTallasMenuOpen(!isTallasMenuOpen)}
                className="py-2.5 px-3 w-full md:text-sm text-gray-900 bg-transparent border border-gray-300 focus:border-blue-500 focus:outline-none flex items-center justify-between rounded font-semibold dark:text-gray-100"
              >
                {selectedTallas.length > 0
                  ? `Tallas seleccionadas: ${selectedTallas.join(", ")}`
                  : "Seleccionar tallas"}
              </button>

              {isTallasMenuOpen && (
                <div
                  className="absolute z-10 top-full left-0 w-36 text-center rounded-md overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 mt-1 text-sm"
                >
                  {tallas.map((talla) => (
                    <div
                      key={talla}
                      onClick={() => handleSelectTalla(talla)}
                      className={`cursor-pointer px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                        selectedTallas.includes(talla)
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-200"
                      } rounded`}
                    >
                      {talla}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Typography className="text-xl font-semibold text-blue-gray-800 text-center mt-10">
              Precio total: {totalPrecio.toFixed(2)} €
            </Typography>
            <Typography className="text-center">
              <Button
                size="lg"
                variant="gradient"
                className="mt-4"
                onClick={() => setShowSuccessPopup(true)}
                disabled={selectedTallas.length === 0}
              >
                Comprar Ahora
              </Button>
            </Typography>
          </CardBody>
        </CardBody>
      </Card>

      <Dialog
        size="xs"
        open={showSuccessPopup}
        handler={() => setShowSuccessPopup(false)}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col items-center">
            <Typography variant="h4" color="green">
              Compra realizada con éxito.
            </Typography>
            <Typography className="mb-3 font-normal text-gray-600 text-center">
              Has comprado {selectedTallas.length} talla(s). Total: {totalPrecio.toFixed(2)} €
            </Typography>
            <Typography
              className="mb-3 font-normal text-gray-600 dark:text-gray-300 text-center"
              variant="paragraph"
            >
              Que tenga un buen día 😁
            </Typography>
          </CardBody>
          <CardFooter>
            <Button
              variant="gradient"
              fullWidth
              onClick={() => setShowSuccessPopup(false)}
            >
              Cerrar
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}
