import { Dialog, Card, CardBody, CardFooter, Input, Typography, Button } from '@material-tailwind/react';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import { useGlobalContext } from '../../context/GlobalContext';
import { useTranslation } from 'react-i18next';

export function ZapatosDeVestirMujer() {
    const { t } = useTranslation()
    const { 
        fetchTableData, 
        zapass, 
        setZapass, 
        activePopup, 
        openPopup,
        editData,
        selectedItem, 
        handleOpenEdit, 
        deleteTableData, 
        newZapatoBota, 
        setNewZapatoBota, 
        handleOpenPut, 
        handleSubmit, 
        handleChange, 
        isAdmin 
    } = useGlobalContext(); 

    const navigate = useNavigate(); // Inicializar useNavigate

    useEffect(() => {
        const fetchZapatosDeVestirMujer = async () => {
            const data = await fetchTableData("ZapatosDeVestirMujer");
            setZapass(data);
        };
        fetchZapatosDeVestirMujer();
    }, []);

    return (
        <div className="container mx-auto py-20 pb-16">
            <h1 className="dark:text-white text-blue-gray-800 text-3xl font-bold mb-4">{t('Zapatos de Vestir para Mujer')}</h1>
            {zapass.length === 0 ? (
                <p className="text-blue-gray-600 dark:text-blue-gray-100">{t('No hay zapatos disponibles')}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {zapass.map((zapatoBota) => (
                        <div
                            key={zapatoBota.id}
                            className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col h-full cursor-pointer transition duration-150 hover:scale-105"
                            onClick={() => navigate(`/detalle-zapato/${zapatoBota.id}`)} // Redirigir al detalle
                        >
                            <img
                                src={zapatoBota.imagen || "https://via.placeholder.com/150"}
                                alt={zapatoBota.nombre}
                                className="w-full h-48 object-cover mb-4 rounded-md"
                            />
                            <h2 className="text-xl font-semibold mb-2 dark:text-white">{zapatoBota.nombre}</h2>
                            <div className="flex flex-col flex-grow">
                                <p className="text-blue-gray-600 dark:text-blue-gray-100 mb-2">Descripción: {zapatoBota.descripcion}</p>
                                <p className="text-blue-gray-600 dark:text-blue-gray-100 mb-2">Talla: {zapatoBota.talla}</p>
                                <p className="text-blue-gray-600 dark:text-blue-gray-100">Precio: {zapatoBota.precio}</p>
                            </div>
                            {isAdmin && (
                                <div className="mt-4 flex justify-between">
                                    <Button size="sm" color="blue" onClick={(e) => { e.stopPropagation(); handleOpenEdit(zapatoBota); }}>{t('Editar')}</Button>
                                    <Button size="sm" color="red" onClick={(e) => { e.stopPropagation(); deleteTableData(zapatoBota.id); }}>{t('Borrar')}</Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {isAdmin && (
                <div className="absolute bottom-20 right-4">
                    <Button onClick={handleOpenPut} variant="gradient">{t('Añadir Zapatos de Vestir')}</Button>
                </div>
            )}

            <Dialog open={activePopup === "newZapatoBota" || activePopup === "editZapatoBota"} handler={openPopup} size="xs" className="bg-transparent shadow-none">
                <Card className="dark:bg-blue-gray-900 dark:text-white mx-auto w-full max-w-[24rem]">
                    <form onSubmit={(editZapatoBota) => {
                        editZapatoBota.preventDefault();
                        handleSubmit("ZapatosDeVestirMujer", newZapatoBota);
                    }}>
                        <CardBody className="flex flex-col gap-4">
                            <Typography variant="h4">{editData ? t('Editar Zapato') : t('Añadir Nuevo Zapato')}</Typography>
                            <Input
                                label={t('Nombre')}
                                size="lg"
                                color="blue-gray"
                                name="nombre"
                                required
                                value={newZapatoBota.nombre}
                                onChange={handleChange}
                                className="dark:text-gray-300"
                            />
                            <Input
                                label={t('Imagen')}
                                size="lg"
                                color="blue-gray"
                                name="imagen"
                                required
                                value={newZapatoBota.imagen}
                                onChange={handleChange}
                                className="dark:text-gray-300"
                            />
                            <Input
                                label={t('Descripción')}
                                size="lg"
                                color="blue-gray"
                                name="descripcion"
                                required
                                value={newZapatoBota.descripcion}
                                onChange={handleChange}
                                className="dark:text-gray-300"
                            />
                            <Input
                                label={t('Talla')}
                                size="lg"
                                color="blue-gray"
                                name="talla"
                                required
                                value={newZapatoBota.talla}
                                onChange={handleChange}
                                className="dark:text-gray-300"
                            />
                            <Input
                                label={t('Precio')}
                                size="lg"
                                color="blue-gray"
                                name="precio"
                                required
                                value={newZapatoBota.precio}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue.replace(/\D/g, "");
                                    setNewZapatoBota((prev) => ({
                                        ...prev,
                                        precio: numericValue ? `${numericValue} €` : "",
                                    }));
                                }}
                                className="dark:text-gray-300"
                            />
                        </CardBody>
                        <CardFooter className="pt-0">
                            <Button variant="gradient" fullWidth type="submit">
                                {editData ? t('Actualizar Zapato') : t('Añadir Zapato')}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </Dialog>
        </div>
    );
}