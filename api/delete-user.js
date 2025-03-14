import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' }); // Solo permite POST
    }

    const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'ID es requerido' });
    }

    try {
        // Obtén el UID del usuario desde la tabla `Usuarios`
        const { data:  fetchError } = await supabase
            .from('Usuarios')
            .select('uid')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        
    } catch (err) {
        console.error('Error al eliminar usuario:', err.message);
        res.status(500).json({ error: 'No se pudo eliminar el usuario' });
    }
}
