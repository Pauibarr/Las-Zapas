import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dialog, Button, Typography, Card, CardBody, CardFooter, Select, Option } from "@material-tailwind/react"; // Importar Select y Option
import { supabase } from "../bd/supabase";

export function Comprar() {
  const { tableName, nombre } = useParams(); // Obtenemos tableName y nombre desde la URL
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Estado local para el popup de éxito
  const [item, setItem] = useState(null); // Estado para los datos del elemento
  const [loading, setLoading] = useState(true); // Estado para la carga
  const [error, setError] = useState(null); // Estado para errores
  const [popupOpen, setPopupOpen] = useState(false); // Estado para mostrar imagen en grande
  const [selectedTalla, setSelectedTalla] = useState(null); // Estado para la talla seleccionada

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from(tableName) // Tabla dinámica desde la URL
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

  const tallas = [37, 38, 39, 40, 41, 42, 43, 44, 45]; // Lista de tallas

  if (loading) {
    return <div className="text-center py-20">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  return (
    <>
      <div className="container mx-auto py-20 px-4">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Imagen del elemento */}
          <div className="w-full md:w-1/2">
            <img
              src={item.imagen || "https://via.placeholder.com/300"}
              alt={item.nombre}
              className="w-full h-auto rounded-lg shadow-md cursor-pointer"
              onClick={() => setPopupOpen(true)}
            />
            {/* Popup para imagen en grande */}
            <Dialog
              open={popupOpen}
              handler={() => setPopupOpen(false)}
              className="bg-transparent shadow-none"
            >
              <img src={item.imagen} alt={item.nombre} className="w-full h-auto rounded-md" />
            </Dialog>
          </div>

          {/* Detalles del elemento */}
          <div className="w-full md:w-1/2">
            <Typography
              variant="h2"
              className="font-bold text-blue-gray-800 dark:text-white mb-4"
            >
              {item.nombre}
            </Typography>
            <Typography
              variant="lead"
              className="text-blue-gray-600 dark:text-blue-gray-200 mb-4"
            >
              {item.descripcion}
            </Typography>
            <Typography className="text-xl font-semibold text-blue-gray-800 dark:text-white mb-4">
              Talla:
              <Select value={selectedTalla} onChange={(value) => setSelectedTalla(value)} className="mt-2">
                {tallas.map((talla) => (
                  <Option key={talla} value={talla.toString()}>{talla}</Option>
                ))}
              </Select>
            </Typography>
            <Typography className="text-xl font-semibold text-blue-gray-800 dark:text-white mb-6">
              Precio: {item.precio || "N/A"}
            </Typography>
            <Button
              size="lg"
              variant="gradient"
              className="mt-4"
              onClick={() => setShowSuccessPopup(true)} // Actualizar el estado para mostrar el popup
            >
              Comprar Ahora
            </Button>
          </div>
        </div>
      </div>

      {/* Popup de éxito */}
      <Dialog
        size="xs"
        open={showSuccessPopup}
        handler={() => setShowSuccessPopup(false)}
        className="bg-transparent shadow-none"
      >
        <Card className="dark:bg-blue-gray-900 dark:text-white mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col items-center">
            <Typography variant="h4" color="green">
              Compra realizada con éxito.
            </Typography>
            <Typography className="mb-3 font-normal text-gray-600 dark:text-gray-300 text-center" variant="paragraph">
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
