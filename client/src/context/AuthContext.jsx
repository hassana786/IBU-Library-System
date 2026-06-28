import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (
        token &&
        storedUser &&
        storedUser !== 'undefined' &&
        storedUser !== 'null'
      ) {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Invalid auth data:', error);

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const response = await authService.login(email, password);

    const { user, token } = response.data.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setUser(user);
    setIsAuthenticated(true);

    return response;
  };

  // REGISTER
  const register = async (
    firstName,
    lastName,
    email,
    password,
    phone,
    address
  ) => {
    const response = await authService.register(
      firstName,
      lastName,
      email,
      password,
      phone,
      address
    );

    const { user, token } = response.data.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setUser(user);
    setIsAuthenticated(true);

    return response;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
    setIsAuthenticated(false);

    authService.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};