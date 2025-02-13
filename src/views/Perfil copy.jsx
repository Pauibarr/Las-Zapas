import { useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { Dialog, Button, Input, Card, CardBody, CardFooter, Alert } from "@material-tailwind/react";
import { supabase } from "../bd/supabase";

const Perfil = () => {
  const { compras, session } = useGlobalContext();
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [showMotivoInput, setShowMotivoInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMotivo, setErrorMotivo] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);

  const handleOpenModal = (compra) => {
    setSelectedCompra(compra);
    setShowModal(true);
    setShowMotivoInput(false);
    setMotivo("");
    setErrorMotivo("");
  };

  const showAlert = (message, color) => {
    setAlertMessage({ message, color });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleEnviarDevolucion = async () => {
    if (!motivo.trim()) {
      setErrorMotivo("Por favor, ingresa un motivo para la devolución.");
      return;
    }
    if (!session?.user?.id) {
      showAlert("Error: Usuario no autenticado. Inicia sesión nuevamente.", "red");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("Devoluciones").insert([{ user_id: session.user.id, compra_id: selectedCompra.id, motivo, estado: "pendiente" }]);
      if (error) throw error;
      showAlert("Solicitud de devolución enviada correctamente.", "green");
      setShowModal(false);
    } catch (error) {
      showAlert("Hubo un error al solicitar la devolución.", "red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-6 flex justify-center items-center">
      <div className="max-w-3xl w-full bg-white shadow-2xl rounded-lg p-8 border border-gray-200">
        <h1 className="text-3xl font-semibold text-gray-900 border-b pb-4 mb-6">Perfil</h1>
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-2xl shadow-md">
            {session?.user?.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-800">{session?.user?.email}</h2>
            <p className="text-gray-500 text-sm">Mi historial de compras</p>
          </div>
        </div>

        <h2 className="text-2xl font-medium text-gray-800 mb-4">Mis Compras</h2>
        <div className="space-y-6">
          {compras.length > 0 ? (
            compras.map((compra) => (
              <div key={compra.id} className="flex items-center bg-gray-50 p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all">
                <img
                  src={compra.producto?.imagen || "https://via.placeholder.com/100"}
                  alt={compra.producto?.nombre}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="ml-5 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{compra.producto?.nombre}</h3>
                  <p className="text-gray-600">{compra.created_at.split("T")[0]}</p>
                  <p className="text-gray-900 font-bold">${compra.producto?.precio}</p>
                </div>
                <Button size="sm" color="red" onClick={() => handleOpenModal(compra)}>
                  Devolución
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No tienes compras registradas.</p>
          )}
        </div>
      </div>

      <Dialog size="xs" open={showModal} handler={() => setShowModal(false)}>
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col items-center">
            {!showMotivoInput ? (
              <>
                <Typography variant="h4" color="red">
                  ¿Seguro que quieres devolver el producto?
                </Typography>
                <Typography className="mb-3 font-normal text-center text-gray-700">
                  {selectedCompra?.producto?.nombre || "Producto desconocido"}
                </Typography>
                <div className="flex justify-between w-full mt-4">
                  <Button color="red" onClick={handleConfirmDevolucion}>Sí, estoy seguro</Button>
                  <Button color="gray" onClick={() => setShowModal(false)}>No quiero devolver</Button>
                </div>
              </>
            ) : (
              <>
                <Typography variant="h5" color="blue">Explica el motivo de la devolución</Typography>
                <Input
                  label="Motivo"
                  value={motivo}
                  onChange={(e) => {
                    setMotivo(e.target.value);
                    setErrorMotivo("");
                  }}
                  className="w-full mt-4"
                  disabled={loading}
                />
                {errorMotivo && <Typography color="red" className="text-sm mt-2">{errorMotivo}</Typography>}
                <div className="flex justify-between w-full mt-4">
                  <Button color="green" onClick={handleEnviarDevolucion} disabled={loading}>
                    {loading ? "Enviando..." : "Enviar"}
                  </Button>
                  <Button color="gray" onClick={() => setShowModal(false)} disabled={loading}>
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </Dialog>

      {alertMessage && (
        <Alert color={alertMessage.color} className="fixed bottom-5 right-5 z-50">
          {alertMessage.message}
        </Alert>
      )}
    </div>
  );
};

export default Perfil;
