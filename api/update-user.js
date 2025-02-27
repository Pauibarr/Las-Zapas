import { supabase } from "../../lib/supabaseClient"; // Asegúrate de importar bien Supabase

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const { userId, nombre, email, password } = req.body;

    try {
        // 1. Actualiza la tabla Usuarios
        const { error: updateError } = await supabase
            .from("Usuarios")
            .update({ nombre, email, password })
            .eq("id", userId);

        if (updateError) {
            throw updateError;
        }

        // 2. Actualiza el autenticador si cambia el email o password
        if (email || password) {
            const { error: authError } = await supabase.auth.updateUser({
                email,
                password,
            });

            if (authError) {
                throw authError;
            }
        }

        // 3. 🚀 **Forzar actualización de la sesión**
        const { data, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
            throw refreshError;
        }

        // 4. Retornamos la sesión actualizada al frontend
        return res.status(200).json({ message: "Usuario actualizado", session: data.session });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
