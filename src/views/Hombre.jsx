import { Dialog, Card, CardBody, CardFooter, Input, Typography, Button } from '@material-tailwind/react';

import { useEffect, useState } from 'react';
import { supabase } from '../bd/supaBase';
import { useGlobalContext } from '../context/globalContext';

export function Hombre(){

    const { activePopup, openPopup, closePopup } = useGlobalContext();  // Obtenemos el contexto
    const [selectedZapatoDeVestirHombre, setSelectedZapatoDeVestirHombre] = useState(null);

    const { isAdmin } = useGlobalContext();
    const [zapatosDeVestirHombre, setZapatosDeVestirHombre] = useState([]);

    const [newZapatoDeVestirHombre, setNewZapatoDeVestirHombre] = useState({
        nombre: '',
        descripcion: '',
        talla: '',
        imagen: '',
        precio: '',
      });
    
      const [editZapatoDeVestirHombre, setEditZapatoDeVestirHombre] = useState(null);
    
      const handleOpen = (zapatoDeVestirHombre) => {
        setSelectedZapatoDeVestirHombre(zapatoDeVestirHombre);
        activePopup(true);
      };
    
      const handleOpenN = () => {
        setEditZapatoDeVestirHombre(null);
        setNewZapatoDeVestirHombre({
          nombre: '',
          descripcion: '',
          talla: '',
          imagen: '',
          precio: '',
        });
        openPopup('newZapato');
      };
    
      const handleOpenEdit = (zapatoDeVestirHombre) => {
        setEditZapatoDeVestirHombre(zapatoDeVestirHombre);
        setNewZapatoDeVestirHombre({
          nombre: zapatoDeVestirHombre.nombre,
          descripcion: zapatoDeVestirHombre.descripcion,
          talla: zapatoDeVestirHombre.talla,
          imagen: zapatoDeVestirHombre.imagen,
          precio: zapatoDeVestirHombre.precio
        });
        openPopup('editZapato');
      };

      //Datos del supabase

      useEffect(() => {
        const fetchZapatosDeVestirHombre = async () => {
          try {
            const { data: zapatosDeVestirHombre, error } = await supabase.from('ZapatosDeVestirHombre').select('*');
            if (error) {
              throw error;
            }
            setZapatosDeVestirHombre(zapatosDeVestirHombre);
          } catch (error) {
            console.error('Error fetching paintings:', error.message);
          }
        };
    
        fetchZapatosDeVestirHombre();
      }, []);
    
      const handleDelete = async (zapatoDeVestirHombreId) => {
        try {
          const { error } = await supabase.from('ZapatosDeVestirHombre').delete().eq('id', zapatoDeVestirHombreId);
          if (error) {
            throw error;
          }
          setZapatosDeVestirHombre(zapatosDeVestirHombre.filter(zapatoDeVestirHombre => zapatoDeVestirHombre.id !== zapatoDeVestirHombreId));
        } catch (error) {
          console.error('Error deleting painting:', error.message);
        }
      };
    
        const handleEditSubmit = async (e) => {
            e.preventDefault();
            try {
            const { data, error } = await supabase.from('ZapatosDeVestirHombre').update(newZapatoDeVestirHombre).eq('id', editZapatoDeVestirHombre.id).select();
            if (error) {
                throw error;
              }
              if (!data || data.length === 0) {
                throw new Error('Update failed, no data returned.');
              }
              setZapatosDeVestirHombre(zapatosDeVestirHombre.map(zapatoDeVestirHombre => (zapatoDeVestirHombre.id === editZapatoDeVestirHombre.id ? data[0] : zapatoDeVestirHombre)));
              setNewZapatoDeVestirHombre({ nombre: '', descripcion: '', talla: '', imagen: '', precio: '',});
              setEditZapatoDeVestirHombre(null);
              setOpenN(false);
            } catch (error) {
              console.error('Error updating painting:', error.message);
            }
        };
    
        const handleChange = (e) => {
          setNewZapatoDeVestirHombre((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
          }));
        };
    
        const handleSubmit = async (e) => {
          e.preventDefault();
          try {
            const { data, error } = await supabase.from('ZapatosDeVestirHombre').insert([newZapatoDeVestirHombre]).select();
            if (error) {
              throw error;
            }
            if (!data || data.length === 0) {
              throw new Error('Insert failed, no data returned.');
            }
            setZapatosDeVestirHombre([...zapatosDeVestirHombre, data[0]]);
            setNewZapatoDeVestirHombre({ nombre: '', descripcion: '', talla: '', image: '', precio: '',});
            setOpenN(false);
          } catch (error) {
            console.error('Error adding painting:', error.message);
          }
        };

    return(
        <div className="container mx-auto py-8 pb-16 relative">
          <h1 className="dark:text-white text-blue-gray-800 text-3xl font-bold mb-4">Zapatos de Vestir</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {zapatosDeVestirHombre.map(zapatoDeVestirHombre => (
              <div key={zapatoDeVestirHombre.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col h-full">
                <button className="w-full transition duration-150 hover:scale-x-105 hover:scale-y-105">
                  <img onClick={() => handleOpen(zapatoDeVestirHombre)} src={zapatoDeVestirHombre.image} alt={zapatoDeVestirHombre.nombre} className="w-full h-48 object-cover mb-4 rounded-md" />
                </button>
                <Dialog
                  size="xs"
                  open={open && selectedZapatoDeVestirHombre === zapatoDeVestirHombre}
                  handler={handleOpen}
                  className="bg-transparent shadow-none"
                >
                  <img src={selectedZapatoDeVestirHombre?.image} alt={selectedZapatoDeVestirHombre?.name} className="w-full mb-4 rounded-md" />
                </Dialog>
                <h2 className="text-xl font-semibold mb-2 dark:text-white">{zapatoDeVestirHombre.nombre}</h2>
                <div className="flex flex-col flex-grow">
                  <p className="text-blue-gray-600 dark:text-blue-gray-100 mb-2">{zapatoDeVestirHombre.descripcion}</p>
                  <p className="text-blue-gray-600 dark:text-blue-gray-100 mn-2">Talla: {zapatoDeVestirHombre.talla}</p>
                  <p className="text-blue-gray-600 dark:text-blue-gray-100">Precio: {zapatoDeVestirHombre.precio}</p>
                </div>
                {isAdmin && (
                  <div className="mt-4 flex justify-between">
                    <Button size="sm" color="blue" onClick={() => handleOpenEdit(zapatoDeVestirHombre)}>Edit</Button>
                    <Button size="sm" color="red" onClick={() => handleDelete(zapatoDeVestirHombre.id)}>Delete</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        
          {isAdmin && (
            <div className="absolute bottom-20 right-4">
              <Button onClick={handleOpenN} variant="gradient">Añadir Zapatos de Vestir</Button>
            </div>
          )}
    
          {/* Popup para agregar o editar zapato */}
        <Dialog open={activePopup === "newZapato" || activePopup === "editZapato"} handler={closePopup} size="xs" className="bg-transparent shadow-none">
          <Card className="dark:bg-blue-gray-900 dark:text-white mx-auto w-full max-w-[24rem]">
            <form onSubmit={editZapatoDeVestirHombre ? handleEditSubmit : handleSubmit}>
              <CardBody className="flex flex-col gap-4">
                <Typography variant="h4">{editZapatoDeVestirHombre ? 'Edit Painting' : 'Add New Painting'}</Typography>
                {/* Form fields */}
                <Input
                  label="Name"
                  size="lg"
                  color="blue-gray"
                  name="name"
                  required
                  value={newZapatoDeVestirHombre.name}
                  onChange={handleChange}
                  className="dark:text-gray-300"
                />
                <Input
                  label="Description"
                  size="lg"
                  color="blue-gray"
                  name="description"
                  required
                  value={newZapatoDeVestirHombre.description}
                  onChange={handleChange}
                  className="dark:text-gray-300"
                />
                {/* Otros campos de entrada */}
              </CardBody>
              <CardFooter className="pt-0">
                <Button variant="gradient" fullWidth type="submit">
                  {editZapatoDeVestirHombre ? 'Update Painting' : 'Add Painting'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </Dialog>
    </div>
    )
}