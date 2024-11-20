import { useEffect, useState } from "react";
import { supabase } from "../bd/supabase";

export function GlobalContext(children){
    const [session, setSession] = useState(null);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setSession(session);
                fetchUserRole(session.user.email);
            } else {
                setSession(null);
                setIsAdmin(false);
            }
        };

        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setSession(session);
                fetchUserRole(session.user.email);
            } else {
                setSession(null);
                setIsAdmin(false);
            }
        });

        //fetchUserRole sirve para que ua persona se registre con un correo en específico se vuelva automaticamente Admin
        const fetchUserRole = async (userEmail) => {
            if (userEmail === 'paulones21052002@gmail.com') {
                setIsAdmin(true);
                return;
            }
            const { data, error } = await supabase
                .from('Profiles')
                .select('role')
                .eq('email', userEmail)
                .single();
            if (data) {
                setIsAdmin(data.role === 'admin');
            } else if (error) {
                console.error('Error fetching user role:', error);
            }
        };

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <GlobalContext.Provider value={{ session, isAdmin, setSession, setIsAdmin }}>
            {children}
        </GlobalContext.Provider>
    );
    
}