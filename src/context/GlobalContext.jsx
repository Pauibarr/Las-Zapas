import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../bd/supabase";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [activePopup, setActivePopup] = useState(null); // Manejo de popups
    const [session, setSession] = useState(null); // Sesión actual del usuario
    const [userData, setUserData] = useState(null); // Datos del usuario
    const [isAdmin, setIsAdmin] = useState(false); // Indica si el usuario es administrador
    const [selectedItem, setSelectedItem] = useState(null);
    const [editData,setEditData] = useState(null);
    const [error, setError] = useState(null); // Manejo de errores
    const [tableData, setTableData] = useState({}); // Datos de las tablas (cache)

    const openPopup = (popupName) => setActivePopup(popupName); // Cambiar popup activo

    const [newZapatoBota, setNewZapatoBota] = useState({
        nombre: "",
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
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            if (session?.user) {
                fetchUserData(session.user.id);
            }
        };

        fetchSession();

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                fetchUserData(session.user.id);
            } else {
                setUserData(null);
                setIsAdmin(false);
            }
        });

        // Limpieza: verifica si existe `subscription` antes de usar `unsubscribe`.
        return () => {
            if (subscription && subscription.unsubscribe) {
                subscription.unsubscribe();
            }
        };
    }, []);

    const fetchUserData = async (uid) => {
        try {
            let { data, error } = await supabase
                .from("Usuarios")
                .select("*")
                .eq("uid", uid)
                .single();

            if (error) throw error;
            setUserData(data);
            setIsAdmin(data.role === 'admin');
        } catch (error) {
            console.error("Error fetching user data:", error.message);
            setError(error.message);
        }
    };

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

    const handleOpenEdit = (item, tableName, popupName) => {
        setEditData(item); // Guarda el objeto actual en edición.
        setTableData((prev) => ({
            ...prev,
            [tableName]: prev[tableName]?.map((data) =>
                data.id === item.id ? { ...data, ...item } : data
            ),
        }));
        openPopup(popupName); // Abre el popup correspondiente.
    };    

    const putZapatoBota = () => {
        setNewZapatoBota({
            nombre: "",
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
            const { data, error } = await supabase.from(tableName).insert([newItem]).select();
            if (error) throw error;
    
            if (!data || data.length === 0) {
                throw new Error("Insert failed, no data returned.");
            }
    
            // Actualizar la cache local con el nuevo dato
            setTableData((prev) => ({
                ...prev,
                [tableName]: [...(prev[tableName] || []), data[0]],
            }));
    
            // Limpia el formulario y cierra el popup si es necesario
            setNewZapatoBota({
                nombre: "",
                descripcion: "",
                talla: "",
                imagen: "",
                precio: "",
            });
    
            openPopup(null); // Cierra el popup activo
        } catch (error) {
            console.error(`Error adding item to ${tableName}:`, error.message);
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
            activePopup,
            openPopup,
            session,
            setSession,
            userData,
            fetchUserData,
            fetchTableData,
            isAdmin,
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