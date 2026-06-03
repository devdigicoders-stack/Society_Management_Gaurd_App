import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('guard_token');
      if (token) {
        try {
          // Parse JWT payload immediately so user is set before API call
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          
          // Check token expiry
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            localStorage.removeItem('guard_token');
            setLoading(false);
            return;
          }

          setUser({ _id: payload.id, role: payload.role, name: payload.name });
          
          // Fetch full profile in background
          const res = await fetchApi('/guards/profile/me');
          if (res.success && res.data) {
            setProfile(res.data);
            if (res.data.user) setUser(res.data.user);
          }
        } catch (error) {
          console.error('Failed to load user profile', error);
          // Only logout on 401 — api.js handles that via window.location
          // For other errors (network, 500), keep the user logged in
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (phone, password) => {
    const res = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password })
    }); 
    
    if (res.success) {
      localStorage.setItem('guard_token', res.token);
      setUser(res.user);
      
      // Fetch profile immediately after login
      try {
        const profileRes = await fetchApi('/guards/profile/me');
        if (profileRes.success && profileRes.data) {
          setProfile(profileRes.data);
        }
      } catch (err) {
        console.warn("Could not fetch guard profile yet", err);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('guard_token');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
