import { Dialog, Card, CardBody, CardFooter, Input, Typography, Button } from '@material-tailwind/react';
import { useEffect } from "react";
import { useGlobalContext } from '../../context/GlobalContext';

export function BotasHombre() {

    const { fetchTableData, zapass, setZapass, activePopup, openPopup, closePopup, selectedItem, handleOpen, editData, handleOpenEdit, deleteTableData, newZapatoBota, setNewZapatoBota, handleOpenPut, editTableData, handleSubmit, handleChange, isAdmin } = useGlobalContext();  // Obtenemos el contexto



    useEffect(() => {
        const fetchZapatosBotas = async () => {
            const data = await fetchTableData("BotasYBotinesHombre");
            setZapass(data);
        };
        fetchZapatosBotas();
    }, []);

    return (
        <div className="container mx-auto py-20 pb-16">
            <h1 className="dark:text-white text-blue-gray-800 text-3xl font-bold mb-4">Botas y Botines para Hombre</h1>
            {zapass.length === 0 ? ( // Length revisa si hay o no datos
                <p className="text-blue-gray-600 dark:text-blue-gray-100">No hay botas disponibles</p>//Si no hay, lanza este párrafo
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {zapass.map((zapatoBota) => (
                        <div key={zapatoBota.id} className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col h-full">
                            <button className="w-full transition duration-150 hover:scale-x-105 hover:scale-y-105">
                                <img
                                    onClick={()=> handleOpen(zapatoBota, "zapatoBotaDetail")}
                                    src={zapatoBota.imagen || "https://via.placeholder.com/150"} // Imagen placeholder si no hay URL
                                    alt={zapatoBota.nombre}
                                    className="w-full h-48 object-cover mb-4 rounded-md"
                                />
                            </button>
                            <Dialog
                              size="xs"
                              open={activePopup ==="zapatoBotaDetail" && selectedItem?.id === zapatoBota.id}
                              handler={()=> openPopup(null)}// Para cerrar el popup
                              className="bg-transparent shadow-none"
                            >
                              <img src={selectedItem?.imagen} alt={selectedItem?.nombre} className="w-full mb-4 rounded-md" />
                            </Dialog>
                            <h2 className="text-xl font-semibold mb-2 dark:text-white">{zapatoBota.nombre}</h2>
                            <div className="flex flex-col flex-grow">
                                <p className="text-blue-gray-600 dark:text-blue-gray-100 mb-2">Descripción: {zapatoBota.descripcion}</p>
                                <p className="text-blue-gray-600 dark:text-blue-gray-100 mn-2">Talla: {zapatoBota.talla}</p>
                                <p className="text-blue-gray-600 dark:text-blue-gray-100">Precio: {zapatoBota.precio}</p>
                            </div>
                            {isAdmin && (
                              <div className="mt-4 flex justify-between">
                                <Button size="sm" color="blue" onClick={() => handleOpenEdit(zapatoBota)}>Edit</Button>
                                <Button size="sm" color="red" onClick={() => deleteTableData(zapatoBota.id)}>Delete</Button>
                              </div>
                            )}
                        </div>
                    ))}
                </div>
                )}

                {isAdmin && (
                    <div className="absolute bottom-20 right-4">
                      <Button onClick={handleOpenPut} variant="gradient">Añadir Botas</Button>
                    </div>
                )}    

                {/* Popup para agregar o editar zapatoBota */}
                <Dialog open={activePopup === "newZapatoBota" || activePopup === "editZapatoBota"} handler={openPopup} size="xs" className="bg-transparent shadow-none">
                <Card className="dark:bg-blue-gray-900 dark:text-white mx-auto w-full max-w-[24rem]">

                  <form onSubmit={(editZapatoBota) => {
                    editZapatoBota.preventDefault();
                    handleSubmit ("BotasYBotinesHombre", newZapatoBota)}}>
                    <CardBody className="flex flex-col gap-4">
                      <Typography variant="h4">{editData ? 'Edit Painting' : 'Add New Painting'}</Typography>
                      {/* Form fields */}
                      <Input
                        label="Nombre"
                        size="lg"
                        color="blue-gray"
                        name="nombre"
                        required
                        value={newZapatoBota.nombre}
                        onChange={handleChange}
                        className="dark:text-gray-300"
                      />
                      <Input
                        label="Imagen"
                        size="lg"
                        color="blue-gray"
                        name="imagen"
                        required
                        value={newZapatoBota.imagen}
                        onChange={handleChange}
                        className="dark:text-gray-300"
                      />
                      <Input
                        label="Descripcion"
                        size="lg"
                        color="blue-gray"
                        name="descripcion"
                        required
                        value={newZapatoBota.descripcion}
                        onChange={handleChange}
                        className="dark:text-gray-300"
                      />
                      <Input
                        label="Talla"
                        size="lg"
                        color="blue-gray"
                        name="talla"
                        required
                        value={newZapatoBota.talla}
                        onChange={handleChange}
                        className="dark:text-gray-300"
                      />
                      <Input
                        label="Precio"
                        size="lg"
                        color="blue-gray"
                        name="precio"
                        required
                        value={newZapatoBota.precio}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                        
                          const numericValue = inputValue.replace(/\D/g, "");// Permitir solo números
                        
                          setNewZapatoBota((prev) => ({
                            ...prev,
                            precio: numericValue ? `${numericValue} €` : "", // Agrega "€" al final
                          }));
                        }}
                        className="dark:text-gray-300"
                      />
                      {/* Otros campos de entrada */}
                    </CardBody>
                    <CardFooter className="pt-0">
                      <Button variant="gradient" fullWidth type="submit">
                        {editData ? 'Update Painting' : 'Add Painting'}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
            </Dialog>
        </div>
    );
}