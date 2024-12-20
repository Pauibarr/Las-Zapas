import React, { createContext, useContext, useState } from "react";
import { supabase } from "../bd/supabase"; // Asegúrate de que el archivo supabase está bien configurado

// Creación del contexto
const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [zapatosDeVestirHombre, setZapatosDeVestirHombre] = useState([]);
  const [newZapatoDeVestirHombre, setNewZapatoDeVestirHombre] = useState({
    nombre: '',
    descripcion: '',
    talla: '',
    imagen: '',
    precio: ''
  });
  const [editZapatoDeVestirHombre, setEditZapatoDeVestirHombre] = useState(null);

  // Estado para gestionar los zapatos de vestir mujer
  const [zapatosDeVestirMujer, setZapatosDeVestirMujer] = useState([]);
  const [newZapatoDeVestirMujer, setNewZapatoDeVestirMujer] = useState({
      nombre: '',
      descripcion: '',
      talla: '',
      imagen: '',
      precio: ''
  });
  const [editZapatoDeVestirMujer, setEditZapatoDeVestirMujer] = useState(null);
  const [activePopup, setActivePopup] = useState(""); // Control de popups

  // Función para obtener los zapatos de la base de datos
  const fetchData = async () => {
    const { data, error } = await supabase
      .from("ZapatosDeVestirHombre")
      .select("*");
    if (error) {
      console.log(error);
    } else {
      setZapatosDeVestirHombre(data);
    }
  };

  // Función para agregar un nuevo zapato
  const addItem = async (zapato) => {
    const { data, error } = await supabase
      .from("ZapatosDeVestirHombre")
      .insert([zapato]);
    if (error) {
      console.log(error);
      return false;
    }
    fetchData(); // Recarga los zapatos
    return true;
  };

  // Función para editar un zapato
  const updateItem = async (id, zapato) => {
    const { data, error } = await supabase
      .from("ZapatosDeVestirHombre")
      .update(zapato)
      .eq("id", id);
    if (error) {
      console.log(error);
      return false;
    }
    fetchData(); // Recarga los zapatos
    return true;
  };

  // Función para eliminar un zapato
  const deleteItem = async (id) => {
    const { error } = await supabase
      .from("ZapatosDeVestirHombre")
      .delete()
      .eq("id", id);
    if (error) {
      console.log(error);
      return false;
    }
    fetchData(); // Recarga los zapatos
    return true;
  };

  // Función para abrir popups
  const openPopup = (popupType) => {
    setActivePopup(popupType);
  };

  // Función para cerrar popups
  const closePopup = () => {
    setActivePopup("");
  };

  return (
    <GlobalContext.Provider
      value={{
        editZapatoDeVestirMujer,
        setEditZapatoDeVestirMujer,
        newZapatoDeVestirMujer,
        setNewZapatoDeVestirMujer,
        zapatosDeVestirMujer,
        setZapatosDeVestirMujer,
        zapatosDeVestirHombre,
        setZapatosDeVestirHombre,
        newZapatoDeVestirHombre,
        setNewZapatoDeVestirHombre,
        editZapatoDeVestirHombre,
        setEditZapatoDeVestirHombre,
        fetchData,
        addItem,
        updateItem,
        deleteItem,
        openPopup,
        closePopup,
        activePopup
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};






















const fetchUserRole = async (userEmail) => {
  if (userEmail === 'paulones21052002@gmail.com') {
      setIsAdmin(true);
      return;
  }
  const { data, error } = await supabase
      .from('Usuarios')
      .select('role')
      .eq('email', userEmail)
      .single();
  if (data) {
      setIsAdmin(data.role === 'admin');
  } else if (error) {
      console.error('Error fetching user role:', error);
  }
};