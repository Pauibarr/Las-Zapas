import { useState, useEffect } from "react";
import { supabase } from "../bd/supabase";
import { Button, Typography, Card } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function Devoluciones() {
  const { t } = useTranslation();
  const [devoluciones, setDevoluciones] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDevoluciones = async () => {
      setLoading(true);

      // 1️⃣ Obtener las devoluciones con la compra asociada
      const { data: devolucionesData, error: devolucionesError } = await supabase
        .from("Devoluciones")
        .select("id, estado, motivo, compra_id, seccion");

      if (devolucionesError) {
        console.error("Error obteniendo devoluciones:", devolucionesError);
        setLoading(false);
        return;
      }

      // 2️⃣ Obtener los datos de las compras asociadas
      const compraIds = devolucionesData.map((dev) => dev.compra_id);
      const { data: compras, error: comprasError } = await supabase
        .from("Compras")
        .select("id, puid, tabla_producto, seccion")
        .in("id", compraIds);

      if (comprasError) {
        console.error("Error obteniendo compras:", comprasError);
        setLoading(false);
        return;
      }

      // 3️⃣ Obtener los productos de sus respectivas tablas
      let productosFinales = [];
      for (const compra of compras) {
        if (!compra.tabla_producto || !compra.puid) continue;

        const { data: producto, error: productoError } = await supabase
          .from(compra.tabla_producto) // Tabla dinámica
          .select("id, nombre, imagen")
          .eq("id", compra.puid)
          .single();

        if (productoError) {
          console.error(`Error obteniendo producto de ${compra.tabla_producto}:`, productoError);
          continue;
        }

        productosFinales.push({ ...producto, compra_id: compra.id });
      }

      // Elimina duplicados por compra_id
      const productosFinalesUnicos = productosFinales.filter(
        (value, index, self) => index === self.findIndex((t) => t.compra_id === value.compra_id)
      );

      // 4️⃣ Unir los productos con sus devoluciones
      const devolucionesConProductos = devolucionesData.map((dev) => {
        const producto = productosFinalesUnicos.find((p) => p.compra_id === dev.compra_id);
        const compra = compras.find((c) => c.id === dev.compra_id);
      
        console.log(compra);  // Verifica la estructura de la compra y si la propiedad 'seccion' existe
      
        return {
          ...dev,
          nombre_producto: producto?.nombre || "Sin producto",
          imagen_producto: producto?.imagen || "https://via.placeholder.com/150",
          categoria_producto: producto?.categoria || "Desconocida",
          seccion_producto: compra?.seccion || "Desconocida", // Revisa si 'compra.seccion' tiene el valor esperado
        };
      });

      setDevoluciones(devolucionesConProductos);
      setLoading(false);
    };

    fetchDevoluciones();
  }, []);

  const handleUpdateEstado = async (id, estado) => {
    setLoading(true);
    const { error } = await supabase.from("Devoluciones").update({ estado }).eq("id", id);
    if (error) {
      console.error("Error actualizando estado:", error);
    } else {
      setDevoluciones((prev) =>
        prev.map((dev) => (dev.id === id ? { ...dev, estado } : dev))
      );
    }
    setLoading(false);
  };
  console.log("hola");  // Verifica la estructura de la compra y si la propiedad 'seccion' existe

  return (
  <div className="min-h-screen bg-gradient-to-bl from-gray-200 dark:from-gray-800 p-6">
    <Typography variant="h3" className="mb-4">Gestión de Devoluciones</Typography>
    <div className=" mt-[100px] space-y-5">
      {loading ? (
        <Typography>Cargando...</Typography>
      ) : devoluciones.length > 0 ? (
        devoluciones.map((dev) => (
          <Card key={dev.id} className="p-4 flex flex-col">
            {/* Imagen a la izquierda */}
              <img
                src={dev.imagen_producto}
                alt={dev.nombre_producto}
                className="w-32 h-32 object-cover rounded-md"
              />

            {/* Datos en el centro */}
              <Typography className="text-gray-600">{t('Sección')}: {dev.seccion_producto}</Typography>
              <Typography variant="h5" className="font-semibold">{dev.nombre_producto}</Typography>
              <Typography className="text-gray-600">{t('Motivo')}: {dev.motivo}</Typography>
              <Typography className="mb-2">{t('Estado')}: {dev.estado}</Typography>

            {/* Botones a la derecha */}
            {dev.estado === "Pendiente" && (
              <div className="space-x-2">
                <Button color="green" onClick={() => handleUpdateEstado(dev.id, "Devuelto")} disabled={loading}>
                  Aceptar
                </Button>
                <Button color="red" onClick={() => handleUpdateEstado(dev.id, "Denegado")} disabled={loading}>
                  Denegar
                </Button>
              </div>
            )}
          </Card>
        ))
      ) : (
        <Typography>{t('No hay devoluciones pendientes')}</Typography>
      )}
    </div>
  </div>
);

}