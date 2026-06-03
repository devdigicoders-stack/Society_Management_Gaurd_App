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
          // Parse JWT payload for immediate user state
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          setUser({ _id: payload.id, role: payload.role });
          
          // Fetch the guard's profile to get additional details like societyId, shift, etc.
          const res = await fetchApi('/guards/profile/me');
          if (res.success && res.data) {
            setProfile(res.data);
            if (res.data.user) setUser(res.data.user);
          } else {
            console.warn("Guard profile is null or not found");
          }
        } catch (error) {
          console.error("Failed to load user profile", error);
          // Don't remove token here! api.js already handles 401/403.
          // This prevents logging the user out on network errors or crashes.
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
