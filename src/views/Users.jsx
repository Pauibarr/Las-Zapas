import { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { supabase, supabaseService } from '../bd/supaBase';
import { useTranslation } from 'react-i18next';

export const Users = () => {
    const { t } = useTranslation();
    const { token, isAdmin, setIsAdmin } = useGlobalContext();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        fetchUsers();
    }, [isAdmin, navigate]);

    const fetchUsers = async () => {
        try {
            let { data, error } = await supabase
                .from('Profiles')
                .select('*')
                .neq('email', 'henareshidalgoruben@fpllefia.com'); // Excluir el usuario con el correo específico
            if (error) throw error;
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            // Obtener el UID del usuario desde la tabla Profiles
            const { data: user, error: fetchError } = await supabase
                .from('Profiles')
                .select('uid')
                .eq('id', userId)
                .single();
            
            if (fetchError) throw fetchError;
            const userUID = user.uid;
    
            // Elimina al usuario del Authenticator usando el UID
            const { error: authError } = await supabaseService.auth.admin.deleteUser(userUID);
            if (authError) throw authError;
    
            // Elimina al usuario de la tabla Profiles
            let { error } = await supabase
                .from('Profiles')
                .delete()
                .eq('id', userId);
            if (error) throw error;
    
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleEditUser = async (userId, updatedUser) => {
        try {
            let { error } = await supabase
                .from('Profiles')
                .update(updatedUser)
                .eq('id', userId);
            if (error) throw error;
            setUsers(users.map(user => user.id === userId ? { ...user, ...updatedUser } : user));
    
            // Si el usuario actualizó su propio rol, refrescar el contexto global
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw sessionError;
            if (session && session.user.id === userId) {
                fetchUserRole(userId);
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const fetchUserRole = async (userId) => {
        const { data, error } = await supabase
            .from('Profiles')
            .select('role')
            .eq('id', userId)
            .single();
        if (data) {
            setIsAdmin(data.role === 'admin');
        } else if (error) {
            console.error('Error fetching user role:', error);
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="container mx-auto py-6">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">{t('User Management')}</h2>
            <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow-md rounded-lg">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                {t('Name')}
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                {t('Role')}
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                {t('Actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm">
                                    <input 
                                        type="text" 
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:border-blue-gray-500 dark:focus:border-white" 
                                        value={user.name_user}
                                        onChange={(e) => handleEditUser(user.id, { name_user: e.target.value })} 
                                    />
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm">
                                    <select 
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:border-blue-gray-500 dark:focus:border-white" 
                                        value={user.role} 
                                        onChange={(e) => handleEditUser(user.id, { role: e.target.value })}>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm">
                                    <button 
                                        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 dark:hover:bg-red-500 focus:outline-none"
                                        onClick={() => handleDeleteUser(user.id)}>
                                        {t('Delete')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};