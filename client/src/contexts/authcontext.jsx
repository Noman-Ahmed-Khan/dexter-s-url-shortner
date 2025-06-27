import { createContext, useContext, useEffect, useState } from 'react';
import getCsrfToken from "../functions/func";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    
    const fetchUser = async () => {
        try {
            const csrfToken = await getCsrfToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "CSRF-Token": csrfToken
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`User fetch failed: ${errorText}`);
            }

            const data = await response.json();
            if (data.status === "success") {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser(); 
    }, []); 

    return (
        <AuthContext.Provider value={{ user, loading, refetchUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
