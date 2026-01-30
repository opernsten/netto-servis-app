/**
 * @module authService
 * @description Služba pro správu autentizace uživatele.
 * Komunikuje přímo se Supabase Auth.
 */

import { supabase } from '../api/supabaseClient';

// 1. Přihlášení emailem a heslem
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

// 2. Odhlášení uživatele
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// 3. Získání aktuálně přihlášeného uživatele (při obnovení stránky)
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};