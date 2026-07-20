'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth';
import type { User, AuthState } from '@/lib/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log("AUTH PROVIDER - useEffect calling checkAuth");
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (process.env.NODE_ENV === 'development') console.log("AUTH PROVIDER - checkAuth START");
    try {
      const user = await AuthService.getCurrentUser();
      if (process.env.NODE_ENV === 'development') console.log("AUTH PROVIDER - checkAuth result:", user);
      setState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
      });
      if (process.env.NODE_ENV === 'development') console.log("AUTH PROVIDER - checkAuth state updated");
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.log("AUTH PROVIDER - checkAuth error:", error);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to check authentication',
      });
    }
  };

  const login = async (email: string, password: string) => {
    if (process.env.NODE_ENV === 'development') console.log("AUTH PROVIDER - login START");
    setState({ ...state, isLoading: true, error: null });
    try {
      if (process.env.NODE_ENV === 'development') console.log("AUTH PROVIDER - calling AuthService.login");
      const response = await AuthService.login({ email, password });
      if (process.env.NODE_ENV === 'development') console.log("AUTH PROVIDER - AuthService.login response:", response);
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      if (process.env.NODE_ENV === 'development') console.log("AUTH PROVIDER - login state updated");
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.log("AUTH PROVIDER - login error:", error);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      });
      throw error;
    }
  };

  const register = async (data: any) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      const response = await AuthService.register(data);
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      });
      throw error;
    }
  };

  const logout = async () => {
    setState({ ...state, isLoading: true });
    try {
      await AuthService.logout();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      });
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
