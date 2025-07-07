import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '../config/api';
import { getItem, setItem, deleteItem } from '../services/storageService';

export type User = {
  id: number;
  login: string;
};

type AuthState = {
  isLoading: boolean;
  isSignout: boolean;
  userToken: string | null;
  userData: User | null;
};

type AuthAction =
  | { type: 'RESTORE_TOKEN'; token: string | null; userData: User | null }
  | { type: 'SIGN_IN'; token: string; userData: User }
  | { type: 'SIGN_OUT' };

type AuthContextType = {
  state: AuthState;
  signIn: (login: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (login: string, senha: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer((prevState: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
      case 'RESTORE_TOKEN':
        return { ...prevState, userToken: action.token, userData: action.userData, isLoading: false };
      case 'SIGN_IN':
        return { ...prevState, isSignout: false, userToken: action.token, userData: action.userData };
      case 'SIGN_OUT':
        return { ...prevState, isSignout: true, userToken: null, userData: null };
      default:
        return prevState;
    }
  }, {
    isLoading: true,
    isSignout: false,
    userToken: null,
    userData: null,
  });

  useEffect(() => {
  (async () => {
    console.log("[AuthContext] Tentando restaurar token..."); // <-- Adicionar log
    try {
      const token = await getItem("userToken");
      const userDataString = await getItem("userData");
      console.log("[AuthContext] Token recuperado:", token); // <-- Adicionar log
      console.log("[AuthContext] UserData string recuperado:", userDataString); // <-- Adicionar log
      const userData = userDataString ? JSON.parse(userDataString) : null;
      console.log("[AuthContext] UserData parseado:", userData); // <-- Adicionar log
      dispatch({ type: "RESTORE_TOKEN", token, userData });
      console.log("[AuthContext] RESTORE_TOKEN despachado."); // <-- Adicionar log
    } catch (e) {
      console.error("[AuthContext] Erro ao restaurar token:", e); // <-- Adicionar log de erro
      // Mesmo em caso de erro, precisamos parar o loading
      dispatch({ type: "RESTORE_TOKEN", token: null, userData: null }); 
    }
  })();
}, []);


  const signIn = async (login: string, senha: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, senha }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || 'Erro ao fazer login');

      await setItem('userToken', data.token);
      await setItem('userData', JSON.stringify(data.usuario));
      dispatch({ type: 'SIGN_IN', token: data.token, userData: data.usuario });
    } catch (err) {
      Alert.alert('Erro no login', err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  const signUp = async (login: string, senha: string) => {
    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, senha }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || 'Erro ao cadastrar');

      Alert.alert('Cadastro realizado', 'Usuário cadastrado com sucesso.');
    } catch (err) {
      Alert.alert('Erro no cadastro', err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  const signOut = async () => {
    await deleteItem('userToken');
    await deleteItem('userData');
    dispatch({ type: 'SIGN_OUT' });
  };

  return (
    <AuthContext.Provider value={{ state, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}
