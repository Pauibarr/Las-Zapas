import { useState, useEffect } from "react";
import { supabase } from "../bd/supabase";
import { Button, Typography, Card, CardBody } from "@material-tailwind/react";

export function Devoluciones() {
  const [devoluciones, setDevoluciones] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDevoluciones = async () => {
      setLoading(true);
      const { data: devolucionesData, error: devolucionesError } = await supabase
        .from("Devoluciones")
        .select("id, motivo, estado, compra_id");

      if (devolucionesError) {
        console.error(devolucionesError);
        setLoading(false);
        return;
      }

      // Obtener las compras asociadas
      const compraIds = devolucionesData.map((dev) => dev.compra_id);
      const { data: compras, error: comprasError } = await supabase
        .from("Compras")
        .select("id, puid, tabla_producto")
        .in("id", compraIds);

      if (comprasError) {
        console.error(comprasError);
        setLoading(false);
        return;
      }

      // Obtener productos de las distintas tablas
      const productosPorTabla = {};
      compras.forEach((compra) => {
        if (!productosPorTabla[compra.tabla_producto]) {
          productosPorTabla[compra.tabla_producto] = [];
        }
        productosPorTabla[compra.tabla_producto].push(compra.puid);
      });

      let productosFinales = [];

      for (const tabla in productosPorTabla) {
        const { data: productos, error: productosError } = await supabase
          .from(tabla)
          .select("id, nombre, imagen, categoria")
          .in("id", productosPorTabla[tabla]);

        if (productosError) {
          console.error(`Error al obtener productos de ${tabla}:`, productosError);
          continue;
        }

        productosFinales = [...productosFinales, ...productos];
      }

      // Relacionar las devoluciones con las compras y los productos
      const devolucionesConProductos = devolucionesData.map((dev) => {
        const compra = compras.find((c) => c.id === dev.compra_id);
        const producto = productosFinales.find((p) => p.id === compra?.puid);
        return {
          ...dev,
          producto: producto || { nombre: "Sin producto", imagen: "", categoria: "Desconocida" },
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
      console.error(error);
    } else {
      setDevoluciones((prev) =>
        prev.map((dev) => (dev.id === id ? { ...dev, estado } : dev))
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-200 dark:from-gray-800 p-6">
      <Typography variant="h3" className="mb-4">Gestión de Devoluciones</Typography>
      <div className="space-y-4">
        {loading ? (
          <Typography>Cargando...</Typography>
        ) : devoluciones.length > 0 ? (
          devoluciones.map((dev) => (
            <Card key={dev.id} className="p-4">
              <CardBody>
                <img
                  src={dev.producto.imagen || "https://via.placeholder.com/150"}
                  alt={dev.producto.nombre}
                  className="w-32 h-32 object-cover rounded-md"
                />
                <Typography variant="h5">{dev.producto.nombre}</Typography>
                <Typography className="text-gray-600">Categoría: {dev.producto.categoria}</Typography>
                <Typography className="text-gray-600">Motivo: {dev.motivo}</Typography>
                <Typography className="mb-2">Estado: {dev.estado}</Typography>
                {dev.estado === "pendiente" && (
                  <div className="flex space-x-2">
                    <Button color="green" onClick={() => handleUpdateEstado(dev.id, "Producto Devuelto")} disabled={loading}>
                      Aceptar
                    </Button>
                    <Button color="red" onClick={() => handleUpdateEstado(dev.id, "Denegada")} disabled={loading}>
                      Denegar
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          ))
        ) : (
          <Typography>No hay devoluciones pendientes.</Typography>
        )}
      </div>
    </div>
  );
}
