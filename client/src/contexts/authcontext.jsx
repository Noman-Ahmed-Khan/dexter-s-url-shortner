import { createContext, useContext, useEffect, useState } from 'react';
import { fetchUser } from "../utils/func";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("state changing")
  
  const fetchAndSetUser = async () => {
  try {
    console.log('Starting fetchAndSetUser...');
    setLoading(true);
    const userValue = await fetchUser();
    console.log('fetchAndSetUser got user:', userValue);
    setUser(userValue);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  const clearUser = () => {
    setUser(null);
  };


  useEffect(() => {
    fetchAndSetUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refetchUser: fetchAndSetUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
