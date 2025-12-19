import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  id: string;
  email: string;
  role: 'SuperAdmin' | 'Moderator' | 'Support' | 'Analyst';
}

interface AuthContextType {
  adminUser: AdminUser | null;
  authToken: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage on initial load
    const storedUser = localStorage.getItem('adminUser');
    const storedToken = localStorage.getItem('adminToken');

    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        setAdminUser(user);
        setAuthToken(storedToken);
      } catch (error) {
        console.error('Failed to parse stored admin user:', error);
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    try {
      setLoading(true);

      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.token) {
        const { token, admin } = data;

        setAuthToken(token);
        setAdminUser(admin);

        if (rememberMe) {
          localStorage.setItem('adminToken', token);
          localStorage.setItem('adminUser', JSON.stringify(admin));
        } else {
          sessionStorage.setItem('adminToken', token);
          sessionStorage.setItem('adminUser', JSON.stringify(admin));
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdminUser(null);
    setAuthToken(null);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminToken');
  };

  const isAuthenticated = !!adminUser && !!authToken;

  return (
    <AuthContext.Provider value={{
      adminUser,
      authToken,
      login,
      logout,
      isAuthenticated,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};