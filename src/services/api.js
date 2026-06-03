const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('guard_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Handle unauthorized or token expiration
        if (endpoint !== '/auth/login') {
          localStorage.removeItem('guard_token');
          window.location.href = '/login';
        }
      }
      throw new Error(data.message || 'An error occurred during the request');
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};
