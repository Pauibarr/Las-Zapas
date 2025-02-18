import { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { Dialog, Button, Typography, Input, Card, CardBody, Alert } from "@material-tailwind/react";
import { supabase } from "../bd/supabase";
import { useTranslation } from "react-i18next";

export function Perfil() {

  const { t } = useTranslation();

  const { compras, session, fetchCompras } = useGlobalContext();
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [showMotivoInput, setShowMotivoInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMotivo, setErrorMotivo] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [devoluciones, setDevoluciones] = useState({});


  useEffect(() => {
    if (session?.user?.id) {
        fetchCompras(session.user.id);
    }
}, [session]);  // Se ejecuta cuando la sesión cambia
  useEffect(() => {
    const fetchDevoluciones = async () => {
      const { data } = await supabase.from("Devoluciones").select("*").eq("user_id", session?.user?.id);
      const devolMap = {};
      data?.forEach((d) => (devolMap[d.compra_id] = d));
      setDevoluciones(devolMap);
    };
    if (session?.user?.id) fetchDevoluciones();
  }, [session]);

  const handleOpenModal = (compra) => {
    setSelectedCompra(compra);
    setShowModal(true);
    setShowMotivoInput(false);
    setMotivo("");
    setErrorMotivo("");
  };

  const handleConfirmDevolucion = () => setShowMotivoInput(true);

  const showAlert = (message, color) => {
    setAlertMessage({ message, color });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleEnviarDevolucion = async () => {
    if (!motivo.trim()) return setErrorMotivo("Por favor, ingresa un motivo.");
    if (!session?.user?.id) return showAlert("Usuario no autenticado.", "red");
    setLoading(true);
    try {
      const { error } = await supabase.from("Devoluciones").insert([{ user_id: session.user.id, compra_id: selectedCompra.id, motivo, estado: "Pendiente" }]);
      if (error) throw error;
      showAlert("Devolución enviada.", "green");
      setShowModal(false);
      setDevoluciones({ ...devoluciones, [selectedCompra.id]: { motivo, estado: "Pendiente" } });
    } catch (error) {
      showAlert("Error al solicitar devolución.", "red");
    } finally {
      setLoading(false);
    }
  };

  const handleEditDevolucion = async (compra) => {
    setSelectedCompra(compra);
    setMotivo(devoluciones[compra.id].motivo);
    setShowModal(true);
    setShowMotivoInput(true);
  };

  const handleUpdateDevolucion = async () => {
    if (!motivo.trim()) return setErrorMotivo("Ingresa un motivo.");
    setLoading(true);
    try {
      const { error } = await supabase.from("Devoluciones").update({ motivo }).eq("compra_id", selectedCompra.id);
      if (error) throw error;
      showAlert("Motivo actualizado.", "green");
      setShowModal(false);
      setDevoluciones({ ...devoluciones, [selectedCompra.id]: { ...devoluciones[selectedCompra.id], motivo } });
    } catch (error) {
      showAlert("Error al actualizar.", "red");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDevolucion = async (compraId) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("Devoluciones").delete().eq("compra_id", compraId);
      if (error) throw error;
      showAlert("Devolución cancelada.", "green");
      const newDevol = { ...devoluciones };
      delete newDevol[compraId];
      setDevoluciones(newDevol);
    } catch (error) {
      showAlert("Error al cancelar devolución.", "red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-200 dark:from-gray-800 p-6 flex justify-center items-center">
      <div className="max-w-3xl w-full bg-white shadow-2xl rounded-lg p-8 border border-gray-200">
        <h1 className="text-3xl font-semibold text-gray-900 border-b pb-4 mb-6">{t('Perfil')}</h1>
        <h2 className="text-2xl font-medium text-gray-800 mb-4">{t('Mis Compras')}</h2>
        <div className="space-y-6">
          {compras.length > 0 ? (
            compras.map((compra) => (
              <div key={compra.id} className="flex items-center bg-gray-50 p-5 rounded-lg shadow-md border hover:shadow-lg transition-all">
                <img src={compra.producto?.imagen || "https://via.placeholder.com/100"} alt={compra.producto?.nombre} className="w-24 h-24 object-cover rounded-md" />
                <div className="ml-5 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{compra.producto?.nombre}</h3>
                  <p className="text-gray-600">{compra.created_at.split("T")[0]}</p>
                  <p className="text-gray-900 font-bold">${compra.producto?.precio}</p>
                  {devoluciones[compra.id] ? (
                    <div className="mt-2">
                      <p className="text-sm text-yellow-800">{t('Estado')}: {devoluciones[compra.id].estado}</p>
                      <div className="flex space-x-2 mt-2">
                        <Button size="sm" color="blue" onClick={() => handleEditDevolucion(compra)}>{t('Editar el Motivo')}</Button>
                        <Button size="sm" color="red" onClick={() => handleCancelDevolucion(compra.id)}>{t('Cancelar Devolución')}</Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" color="red" onClick={() => handleOpenModal(compra)}>{t('Devolución')}</Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">{t('No tienes compras registradas')}</p>
          )}
        </div>
      </div>
      <Dialog size="xs" open={showModal} handler={() => setShowModal(false)}>
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col items-center">
            {!showMotivoInput ? (
              <>
                <Typography variant="h4" className="text-red-600">{t('¿Seguro que quieres devolver el producto?')}</Typography>
                <Typography className="mb-3 font-normal text-center text-gray-700">{selectedCompra?.producto?.nombre || "Producto desconocido"}</Typography>
                <div className="flex justify-between w-full mt-4">
                  <Button color="red" onClick={handleConfirmDevolucion}>{t('Sí, estoy seguro')}</Button>
                  <Button color="gray" onClick={() => setShowModal(false)}>{t('No quiero devolver')}</Button>
                </div>
              </>
            ) : (
              <>
                <Typography variant="h5" className="text-gray-800 font-extrabold">{t('Motivo de la devolución')}</Typography>
                <Input label={t('Motivo')} value={motivo} onChange={(e) => { setMotivo(e.target.value); setErrorMotivo(""); }} className="w-full" disabled={loading} />
                {errorMotivo && <Typography className="text-red-600 text-sm mt-2">{errorMotivo}</Typography>}
                <div className="flex justify-between w-full mt-4">
                  <Button color="green" onClick={selectedCompra && devoluciones[selectedCompra.id] ? handleUpdateDevolucion : handleEnviarDevolucion} disabled={loading}>
                    {loading ? "Enviando..." : "Guardar"}
                  </Button>
                  <Button color="gray" onClick={() => setShowModal(false)} disabled={loading}>{t('Cancelar')}</Button>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </Dialog>
      {alertMessage && <Alert color={alertMessage.color} className="fixed bottom-5 z-50">{alertMessage.message}</Alert>}
    </div>
  );
}