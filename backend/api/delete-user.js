import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' }); // Solo permite POST
    }

    const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { uid } = req.body;

    if (!uid) {
        return res.status(400).json({ error: 'UID es requerido' });
    }

    try {
        // Eliminar usuario en Supabase Auth
        const { error } = await supabase.auth.admin.deleteUser(uid);
        if (error) throw error;

        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar usuario:', err.message);
        res.status(500).json({ error: 'No se pudo eliminar el usuario' });
    }
}
