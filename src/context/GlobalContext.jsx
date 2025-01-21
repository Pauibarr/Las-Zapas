import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../bd/supabase";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

    // Esto es para las imagenes desde la base de datos para hombre y mujer
    const [zapatosHombre, setZapatosHombre] = useState([]);
    const [zapatillasHombre, setZapatillasHombre] = useState([]);
    const [botasHombre, setBotasHombre] = useState([]);
    const [zapatosMujer, setZapatosMujer] = useState([]);
    const [zapatillasMujer, setZapatillasMujer] = useState([]);
    const [botasMujer, setBotasMujer] = useState([]);
    ////////////////////////////

    const [zapass, setZapass] = useState([]);
    const [activePopup, setActivePopup] = useState(null); // Manejo de popups
    const [session, setSession] = useState(null); // Sesión actual del usuario
    const [usuarios, setUsuarios] = useState([]); // Definición del estado usuarios
    const [userData, setUserData] = useState(null); // Datos del usuario
    const [isAdmin, setIsAdmin] = useState(false); // Indica si el usuario es administrador
    const [selectedItem, setSelectedItem] = useState(null);
    const [editData,setEditData] = useState(null);
    const [error, setError] = useState(null); // Manejo de errores
    const [tableData, setTableData] = useState({}); // Datos de las tablas (cache)

    const openPopup = (popupName) => setActivePopup(popupName); // Cambiar popup activo

    const [newZapatoBota, setNewZapatoBota] = useState({
        nombre: "",
        created_at: "",
        descripcion: "",
        talla: "",
        imagen: "",
        precio: "",
    });

    // Idioma predeterminado para la traducción
    const [language, setLanguage] = useState("es");

    // Función para traducir texto usando LibreTranslate
    const translateText = async (text, targetLang) => {
        try {
            const response = await axios.post("https://libretranslate.com/translate", {
                q: text,
                source: "auto", // Detecta automáticamente el idioma de origen
                target: targetLang,
                format: "text",
            });
            return response.data.translatedText;
        } catch (error) {
            console.error("Error translating text:", error.message);
            setError("No se pudo realizar la traducción.");
            return text; // Retorna el texto original si hay un error
        }
    };

    useEffect(() => {
            const fetchSession = async () => {
                const { data } = await supabase.auth.getSession();
                setSession(data.session);
        
                if (data.session?.user) {
                    await fetchUserData(data.session.user.id);
                } else {
                    setIsAdmin(false); // Por defecto, no es admin si no hay sesión
                }
            };
        
            fetchSession();
        
            const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);
        
                if (session?.user) {
                    fetchUserData(session.user.id);
                } else {
                    setIsAdmin(false); // Por defecto, no es admin si no hay sesión
                }
            });
        
            return () => subscription?.unsubscribe?.();
        
    }, []);

    const fetchUserData = async (uid) => {
        try {
            const { data, error } = await supabase
                .from("Usuarios") // Nombre de tu tabla
                .select("role") // Selecciona únicamente el campo `role`
                .eq("uid", uid) // Filtra por el ID del usuario
                .single(); // Obtén un único resultado
    
            if (error) throw error;
    
            setIsAdmin(data.role === "admin"); // Actualiza `isAdmin` basado en el rol
        } catch (error) {
            console.error("Error fetching user data:", error.message);
            setIsAdmin(false); // Por seguridad, asume que no es admin si hay un error
        }
    };
    
    //Vista Usuarios
     // Función para obtener los usuarios desde Supabase
     const fetchUsuarios = async () => {
        try {
            // Obtiene todos los usuarios de la tabla "Usuarios"
            const { data, error } = await supabase.from("Usuarios").select("*");

            if (error) throw error;
            setUsuarios(data);
        } catch (error) {
            console.error("Error fetching users:", error.message);
            setError(error.message);
        }
    };

    // Función para actualizar un usuario (cambiar nombre o rol)
    const updateUser = async (id, updates) => {
        try {
            const { data, error } = await supabase.from("Usuarios").update(updates).eq("id", id).select();

            if (error) throw error;

            // Actualiza la lista de usuarios en el estado local
            setUsuarios((prev) => {
                return prev.map((user) => (user.id === id ? data[0] : user));
            });
        } catch (error) {
            console.error("Error updating user:", error.message);
            setError(error.message);
        }
    };

    // Función para eliminar un usuario
    const deleteUser = async (id) => {
        try {
            // Obtén el UID del usuario en el sistema de autenticación
            const { data: user, error: fetchError } = await supabase
                .from("Usuarios")
                .select("uid") // Asegúrate de que tienes el campo `uid` en tu tabla `Usuarios`
                .eq("id", id)
                .single();
    
            if (fetchError) throw fetchError;
    
            // Elimina al usuario de Supabase Auth
            const { error: authError } = await supabase.auth.admin.deleteUser(user.uid);
            if (authError) throw authError;
    
            // Elimina al usuario de la tabla `Usuarios`
            const { error: tableError } = await supabase.from("Usuarios").delete().eq("id", id);
            if (tableError) throw tableError;
    
            // Actualiza el estado local
            setUsuarios((prev) => prev.filter((user) => user.id !== id));
        } catch (error) {
            console.error("Error deleting user:", error.message);
            setError(error.message);
        }
    };
    
    

    //Fin: Vista Usuarios

    const fetchTableData = async (tableName) => {
        if (tableData[tableName]) {
            return tableData[tableName];
        }

        try {
            const { data, error } = await supabase.from(tableName).select("*");
            if (error) throw error;
            setTableData((prev) => ({ ...prev, [tableName]: data }));
            return data;
        } catch (error) {
            console.error(`Error fetching data from ${tableName}:`, error.message);
            setError(error.message);
            return [];
        }
    };

    const handleOpen = (item, popupName) => {
        setSelectedItem(item);
        openPopup(popupName);
    };

    const editTableData = async (tableName, id, updates) => {
        try {
            const { data, error } = await supabase
                .from(tableName)
                .update(updates)
                .eq("id", id)
                .select();

            if (error) throw error;

            if (!data || data.length === 0) {
                throw new Error("Update failed, no data returned.");
            }

            setTableData((prev) => {
                const updatedTable = prev[tableName]?.map((item) =>
                    item.id === id ? data[0] : item
                );
                return { ...prev, [tableName]: updatedTable };
            });

            return data[0];
        } catch (error) {
            console.error(`Error updating data in ${tableName}:`, error.message);
            setError(error.message);
        }
    };

    const handleOpenEdit = (tableName, item) => {
        setEditData(item); // Guarda los datos actuales en edición.
        setNewZapatoBota(item); // Actualiza el formulario con los datos del zapato.
        openPopup("editZapatoBota"); // Abre el popup de edición.
    };    
    

    const putZapatoBota = () => {
        setNewZapatoBota({
            nombre: "",
            created_at: "",
            descripcion: "",
            talla: "",
            imagen: "",
            precio: "",
        })
    }

    const handleOpenPut = () => {
        putZapatoBota();
        openPopup("newZapatoBota");
    }

    const handleSubmit = async (tableName, newItem) => {
        try {
            const { created_at, ...dataToSubmit } = newItem; // Excluye created_at
            const itemToSubmit = editData ? newItem : dataToSubmit; // Solo envía `created_at` si es necesario
    
            let data;
            if (editData) {
                // Modo edición
                const { data: updatedData, error } = await supabase
                    .from(tableName)
                    .update(itemToSubmit)
                    .eq("id", editData.id)
                    .select();
                if (error) throw error;
                data = updatedData[0];
            } else {
                // Modo creación
                const { data: insertedData, error } = await supabase
                    .from(tableName)
                    .insert([itemToSubmit])
                    .select();
                if (error) throw error;
                data = insertedData[0];
            }
    
            // Limpia el formulario y cierra el popup
            setNewZapatoBota({
                nombre: "",
                created_at: "",
                descripcion: "",
                talla: "",
                imagen: "",
                precio: "",
            });
            setEditData(null);
            openPopup(null);
        } catch (error) {
            console.error(`Error handling item in ${tableName}:`, error.message);
            setError(error.message);
        }
    };
    

    const deleteTableData = async (tableName, id) => {
        try {
            const { error } = await supabase.from(tableName).delete().eq("id", id);
            if (error) throw error;

            setTableData((prev) => {
                const updatedTable = prev[tableName]?.filter((item) => item.id !== id);
                return { ...prev, [tableName]: updatedTable };
            });
        } catch (error) {
            console.error(`Error deleting data from ${tableName}:`, error.message);
            setError(error.message);
        }
    };

    const handleChange = (editZapatoBota) => {
        const { name, value } = editZapatoBota.target;
        setNewZapatoBota((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            setSession(null);
            setUserData(null);
        } catch (error) {
            console.error("Error logging out:", error.message);
            setError(error.message);
        }
    };

    return (
        <GlobalContext.Provider value={{
            zapatosHombre,
            setZapatosHombre,
            zapatillasHombre,
            setZapatillasHombre,
            botasHombre,
            setBotasHombre,
            zapatosMujer,
            setZapatosMujer,
            zapatillasMujer,
            setZapatillasMujer,
            botasMujer,
            setBotasMujer,
            zapass,
            setZapass,
            activePopup,
            openPopup,
            session,
            setSession,
            userData,
            fetchUserData,
            usuarios,
            fetchUsuarios,
            updateUser,
            deleteUser,
            fetchTableData,
            isAdmin,
            setIsAdmin,
            selectedItem,
            handleOpen,
            editTableData,
            editData,
            setEditData,
            handleOpenEdit,
            newZapatoBota,
            setNewZapatoBota,
            handleOpenPut,
            handleSubmit,
            deleteTableData,
            handleChange,
            language,
            setLanguage,
            translateText,
            logout,
            error,
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);