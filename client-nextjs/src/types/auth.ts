export interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  isAdmin?: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userData: User, userToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  message?: string;
  emailSent?: boolean;
  user?: User;
  token?: string;
}