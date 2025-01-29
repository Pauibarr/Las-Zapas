import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export const Usuarios = () => {
    const { t } = useTranslation()
    const { usuarios, deleteUser, updateUser, fetchUsuarios } = useGlobalContext();
    const [editUserId, setEditUserId] = useState(null);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    const handleNameChange = (e, userId) => {
        setNewName(e.target.value);
        setEditUserId(userId);
    };

    const saveNameChange = (userId) => {
        if (newName.trim()) {
            updateUser(userId, { name_user: newName });
        }
        setEditUserId(null);
    };

    const handleKeyDown = (e, userId) => {
        if (e.key === "Enter") {
            saveNameChange(userId);
        }
    };

    const cancelEdit = () => {
        setEditUserId(null);
        setNewName("");
    };

    return (
        <div className="container mx-auto py-20 pb-16">
            <h1 className="dark:text-white text-blue-gray-800 text-3xl font-bold mb-4">
                {t('Gestión de Usuarios')}
            </h1>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="w-full table-auto text-left text-sm text-gray-500 dark:text-gray-300">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 border-b border-gray-600 dark:border-gray-200 dark:bg-gray-900 dark:text-gray-100">
                        <tr>
                            <th className="px-6 py-3">{t('Nombre')}</th>
                            <th className="px-6 py-3">{t('Correo')}</th>
                            <th className="px-6 py-3">{t('Rol')}</th>
                            <th className="px-6 py-3">{t('Acciones')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios?.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                            >
                                <td className="px-6 py-4">
                                    {editUserId === user.id ? (
                                        <input
                                            type="text"
                                            value={newName || user.name_user}
                                            onChange={(e) => handleNameChange(e, user.id)}
                                            onKeyDown={(e) => handleKeyDown(e, user.id)}
                                            className="px-2 py-1 border border-gray-300 rounded-md"
                                        />
                                    ) : (
                                        user.name_user
                                    )}
                                </td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                                            user.role === "admin"
                                                ? "bg-green-200 text-green-800"
                                                : "bg-yellow-200 text-yellow-800"
                                        }`}
                                    >
                                        {t(`roles.${user.role}`)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <Button
                                        size="sm"
                                        color="red"
                                        onClick={() => deleteUser(user.id)}
                                        className="hover:bg-red-700 mr-2"
                                    >
                                        {t('Eliminar')}
                                    </Button>
                                    {editUserId === user.id ? (
                                        <>
                                            <Button
                                                size="sm"
                                                color="green"
                                                onClick={() => saveNameChange(user.id)}
                                                className="hover:bg-green-700 mr-2"
                                            >
                                                {t('Guardar')}
                                            </Button>
                                            <Button
                                                size="sm"
                                                color="gray"
                                                onClick={cancelEdit}
                                                className="hover:bg-gray-700 mr-2"
                                            >
                                                {t('Cancelar')}
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            size="sm"
                                            color="blue"
                                            onClick={() => {
                                                setEditUserId(user.id);
                                                setNewName(user.name_user);
                                            }}
                                            className="hover:bg-blue-700 mr-2"
                                        >
                                            {t('Editar Nombre')}
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        color="blue"
                                        onClick={() =>
                                            updateUser(user.id, {
                                                role: user.role === "admin" ? "user" : "admin",
                                            })
                                        }
                                        className="hover:bg-blue-700"
                                    >
                                        {user.role === "admin"
                                            ? t('Convertir a Usuario')
                                            : t('Hacer Admin')
                                        }
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
