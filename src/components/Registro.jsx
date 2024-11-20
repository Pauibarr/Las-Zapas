import { Button, Card, CardBody, CardFooter, Dialog, Typography, Input } from "@material-tailwind/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../bd/supabase";
import { useGlobalContext } from "../context/GlobalContext";

export const Registro = () => {
    const { activePopup, openPopup } = useGlobalContext(); // Accedemos al contexto
    const handleOpen = () => openPopup("registro"); // Abrir el popup del registro

    const [dialogData, setDialogData] = useState({
        name: '', email: '', password: '', confirmPassword: '' // Se mantiene el confirmPassword
    });

    async function handleSubmit(e) {
        e.preventDefault();

        // Verificamos si las contraseñas coinciden antes de continuar con el registro
        if (dialogData.password !== dialogData.confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        try {
            // Realizamos el registro en Supabase
            let { data, error } = await supabase.auth.signUp({
                email: dialogData.email,
                password: dialogData.password,
                options: {
                    data: {
                        name: dialogData.name
                    }
                }
            });

            if (error) throw error;

            // Luego creamos el perfil en la base de datos
            const uid = data.user.id;
            const role = data.user.email === 'paulones21052002@gmail.com' ? 'admin' : 'user';
            let { error: profileError } = await supabase.from('Usuarios').insert([{
                uid: uid,
                email: data.user.email,
                name_user: dialogData.name,
                role: role,
                created_at: new Date()
            }]);

            if (profileError) throw profileError;

            alert('Registro exitoso');
            openPopup(null); // Cerrar el popup después de un registro exitoso

        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    }

    function handleChange(event) {
        setDialogData((prevDialogData) => ({
            ...prevDialogData,
            [event.target.name]: event.target.value
        }));
    }

    return (
        <>
            <Button onClick={handleOpen}>Registro</Button>
            <Dialog
                size="xs"
                open={activePopup === "registro"} // El popup solo se muestra si `activePopup` es "registro"
                handler={openPopup}
                className="bg-transparent shadow-none"
            >
                <div className="card bg-blue-400 shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6"></div>
                <div className="card bg-red-400 shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"></div>
                <Card className="dark:bg-blue-gray-900 dark:text-white mx-auto w-full max-w-[24rem]">
                    <form onSubmit={handleSubmit}>
                        <CardBody className="flex flex-col gap-4">
                            <Typography variant="h4">Registro</Typography>
                            <Typography className="mb-3 font-normal text-gray-600 dark:text-gray-300" variant="paragraph">
                                Ingresa tu correo y contraseña para registrarte.
                            </Typography>
                            <Typography className="-mb-2" variant="h6">Nombre</Typography>
                            <Input
                                color="blue-gray"
                                className="dark:text-gray-300"
                                label="Nombre"
                                size="lg"
                                name="name"
                                type="text"
                                required
                                onChange={handleChange}
                            />
                            <Typography className="-mb-2" variant="h6">Correo Electrónico</Typography>
                            <Input
                                color="blue-gray"
                                className="dark:text-gray-300"
                                label="Correo Electrónico"
                                size="lg"
                                name="email"
                                type="email"
                                required
                                onChange={handleChange}
                            />
                            <Typography className="-mb-2" variant="h6">Contraseña</Typography>
                            <Input
                                color="blue-gray"
                                className="dark:text-gray-300"
                                label="Contraseña"
                                size="lg"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                onChange={handleChange}
                            />
                            <Typography className="-mb-2" variant="h6">Confirmar Contraseña</Typography>
                            <Input
                                color="blue-gray"
                                className="dark:text-gray-300"
                                label="Confirmar Contraseña"
                                size="lg"
                                name="confirmPassword"
                                type="password"
                                required
                                autoComplete="current-password"
                                onChange={handleChange}
                            />
                        </CardBody>
                        <CardFooter className="pt-0">
                            <Button variant="gradient" fullWidth type="submit">Registrarse</Button>
                            <Typography variant="small" className="mt-4 flex justify-center">
                                ¿Ya eres cliente?
                            </Typography>
                            <Link to="/login" onClick={() => openPopup("login")}>
                                <Button color="white" size="lg" fullWidth>Iniciar sesión</Button>
                            </Link>
                        </CardFooter>
                    </form>
                </Card>
            </Dialog>
        </>
    );
};