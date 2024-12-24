
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Depurar las variables
console.log('Supabase URL:', supabaseUrl); // Verifica que no sea undefined
console.log('Supabase Key:', supabaseKey); // Verifica que no sea undefined

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key is missing. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY
export const supabaseService = createClient(supabaseUrl, supabaseServiceKey)