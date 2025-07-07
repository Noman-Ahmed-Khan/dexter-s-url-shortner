import { createContext, useContext, useEffect, useState } from 'react';
import { fetchUser } from "../utils/func";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const fetchAndSetUser = async () => {
  try {
    setLoading(true);
    const userValue = await fetchUser();
    setUser(userValue);
    } catch (err) {
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
