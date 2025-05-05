export interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
} 