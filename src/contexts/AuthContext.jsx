import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../api/supabaseClient';
import { loginUser, logoutUser } from '../services/authService';

// Vytvoření kontextu (prázdná schránka)
const AuthContext = createContext({});

// Tento "Provider" obalí celou aplikaci a bude rozdávat informace o přihlášení
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Při načtení stránky se zeptáme Supabase: "Je už někdo přihlášen?"
  useEffect(() => {
    // 1. Zjisti aktuální stav
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkUser();

    // 2. Poslouchej změny (kdyby se uživatel přihlásil v jiném okně)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Funkce pro přihlášení (použijeme v Login formuláři)
  const login = async (email, password) => {
    const data = await loginUser(email, password);
    if (data.user) setUser(data.user);
    return data;
  };

  // Funkce pro odhlášení
  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Vlastní hook, abychom nemuseli psát useContext(AuthContext)
export const useAuth = () => useContext(AuthContext);