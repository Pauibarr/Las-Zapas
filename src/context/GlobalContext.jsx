import { createContext, useContext, useState, useEffect } from "react";
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

    const [compras, setCompras] = useState([]);
    const [zapass, setZapass] = useState([]);
    const [activePopup, setActivePopup] = useState(null); // Manejo de popups
    const [session, setSession] = useState(null); // Sesi贸n actual del usuario
    const [usuarios, setUsuarios] = useState([]); // Definici贸n del estado usuarios
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
        imagen: "",
        precio: "",
    });

    useEffect(() => {
            const fetchSession = async () => {
                const { data } = await supabase.auth.getSession();
                setSession(data.session);
        
                if (data.session?.user) {
                    await fetchUserData(data.session.user.id);
                    await fetchCompras(data.session.user.id);  // 馃憠 Llamar funci贸n aqu铆
                } else {
                    setIsAdmin(false); // Por defecto, no es admin si no hay sesi贸n
                    setCompras([]);  // Limpiar compras si no hay sesi贸n

                }
            };
        
            fetchSession();
        
            const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);
        
                if (session?.user) {
                    fetchUserData(session.user.id);
                    fetchCompras(session.user.id);  // 馃憠 Actualizar compras al cambiar usuario
                } else {
                    setIsAdmin(false); // Por defecto, no es admin si no hay sesi贸n
                    setCompras([]);
                }
            });
        
            return () => subscription?.unsubscribe?.();
        
    }, []);

    const fetchUserData = async (uid) => {
        try {
            const { data, error } = await supabase
                .from("Usuarios") // Nombre de tu tabla
                .select("role") // Selecciona 煤nicamente el campo `role`
                .eq("uid", uid) // Filtra por el ID del usuario
                .single(); // Obt茅n un 煤nico resultado
    
            if (error) throw error;
    
            setIsAdmin(data.role === "admin"); // Actualiza `isAdmin` basado en el rol
        } catch (error) {
            console.error("Error fetching user data:", error.message);
            setIsAdmin(false); // Por seguridad, asume que no es admin si hay un error
        }
    };
    
    //Vista Usuarios
     // Funci贸n para obtener los usuarios desde Supabase
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

    // Funci贸n para actualizar un usuario (cambiar nombre o rol)
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

    // Funci贸n para eliminar un usuario
    const deleteUser = async (id) => {
        try {
            // Haz la solicitud al endpoint del backend
            const response = await fetch('https://laszapas.vercel.app/api/delete-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
    
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al eliminar el usuario');
            }
    
            // Si se elimina con 茅xito, actualiza el estado local
            setUsuarios((prev) => prev.filter((user) => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error.message);
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

    //Compras

    const fetchCompras = async (userId) => {
        try {
            const { data: compras, error } = await supabase
                .from("Compras")
                .select("id, created_at, puid, tabla_producto, talla")
                .eq("uid", userId);
            
            if (error) throw error;
    
            // Obtener los detalles de cada producto de su tabla respectiva
            const productosComprados = await Promise.all(
                compras.map(async (compra) => {
                    const { data: producto, error: errorProducto } = await supabase
                        .from(compra.tabla_producto) // Consultamos en la tabla espec铆fica
                        .select("nombre, imagen, precio")
                        .eq("id", compra.puid)
                        .single();
                    
                    if (errorProducto) {
                        console.error(`Error obteniendo producto ${compra.puid} de ${compra.tabla_producto}:`, errorProducto);
                        return null;
                    }
    
                    return { ...compra, producto };
                })
            );
    
            // Filtramos los productos que se encontraron correctamente
            setCompras(productosComprados.filter(item => item !== null));
    
        } catch (error) {
            console.error("Error obteniendo compras:", error.message);
            setError(error.message);
        }
    };
    
    /////////////////

    const handleOpenImage = (item) => {
        setSelectedItem(item); // Establece el elemento seleccionado para el popup.
        openPopup("zapatoBotaDetail"); // Abre el popup espec铆fico de la imagen.
    };
    

    const handleOpenEdit = (tableName, item) => {
        setEditData(item); // Guarda los datos actuales en edici贸n.
        setNewZapatoBota(item); // Actualiza el formulario con los datos del zapato.
        openPopup("editZapatoBota"); // Abre el popup de edici贸n.
    };    
    

    const putZapatoBota = () => {
        setNewZapatoBota({
            nombre: "",
            created_at: "",
            descripcion: "",
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
            const itemToSubmit = editData ? newItem : dataToSubmit; // Solo env铆a `created_at` si es necesario
    
            let data;
            if (editData) {
                // Modo edici贸n
                const { data: updatedData, error } = await supabase
                    .from(tableName)
                    .update(itemToSubmit)
                    .eq("id", editData.id)
                    .select();
                if (error) throw error;
                data = updatedData[0];
    
                // Actualizar el estado zapass
                setZapass(prev => prev.map(item => item.id === data.id ? data : item));
    
                // Tambi茅n actualiza tableData para reflejar los cambios en cach茅
                setTableData((prev) => ({
                    ...prev,
                    [tableName]: prev[tableName]?.map((item) => item.id === data.id ? data : item)
                }));
            } else {
                // Modo creaci贸n
                const { data: insertedData, error } = await supabase
                    .from(tableName)
                    .insert([itemToSubmit])
                    .select();
                if (error) throw error;
                data = insertedData[0];
    
                // Agregar el nuevo elemento al estado zapass
                setZapass(prev => [...prev, data]);
    
                // Tambi茅n actualiza tableData para reflejar los cambios en cach茅
                setTableData((prev) => ({
                    ...prev,
                    [tableName]: [...(prev[tableName] || []), data]
                }));
            }
    
            // Limpia el formulario y cierra el popup
            setNewZapatoBota({
                nombre: "",
                created_at: "",
                descripcion: "",
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
            const { error } = await supabase.auth.signOut();
    
            if (error) {
                throw error;
            }
    
            // Limpiar el estado de la sesión
            setSession(null);
            setUserData(null);
            setIsAdmin(false);
            setCompras([]);
    
            // Forzar la actualización de la sesión en Supabase
            const { data } = await supabase.auth.getSession();
            console.log("Sesión después del logout:", data.session); // Debería ser null
    
            // Redirigir a la página de inicio
            navigate("/");
        } catch (error) {
            console.error("Error cerrando sesión:", error.message);
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
            compras,
            fetchCompras,
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
            handleOpenImage,
            handleOpenEdit,
            newZapatoBota,
            setNewZapatoBota,
            handleOpenPut,
            handleSubmit,
            deleteTableData,
            handleChange,
            logout,
            error,
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);