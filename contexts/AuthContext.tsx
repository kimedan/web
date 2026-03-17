
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '../utils/firebase';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, pw: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Monitor Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        console.log("User session restored:", user.email);
        setIsAuthenticated(true);
      } else {
        console.log("No active session");
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pw: string): Promise<boolean> => {
    // 1. 이메일 형식 검사 (Double Check)
    // 'dmcadmin' 같은 아이디 입력 시 아예 요청을 보내지 않음
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format detected. Login blocked.");
      return false;
    }

    try {
      // 2. Firebase 인증 시도
      await signInWithEmailAndPassword(auth, email, pw);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      // 혹시 모를 로컬 스토리지 잔여 데이터 제거 (구 버전 호환)
      localStorage.removeItem('auth'); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
