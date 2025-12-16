import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  signIn,
  signOut,
  signUp,
  fetchMe,
  type AuthUser,
} from "../api/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    passwordConfirmation: string,
    username: string
  ) => Promise<void>;
}



const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_TOKEN_KEY = "authToken";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    async function init() {
      try {
        const me = await fetchMe();
        setUser(me);
      } catch {
        // Token invalid/expired
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    void init();
  }, []);

  async function login(email: string, password: string) {
    const response = await signIn(email, password);
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    setUser(response.user);
  }

async function register(
  email: string,
  password: string,
  passwordConfirmation: string,
  username: string
) {
  const response = await signUp(email, password, passwordConfirmation, username);
  localStorage.setItem(AUTH_TOKEN_KEY, response.token);
  setUser(response.user);
}



  async function logout() {
    try {
      await signOut();
    } catch {
      // Ignore errors on sign out
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
  value={{
    user,
    isAuthenticated: user !== null,
    loading,
    login,
    logout,
    signUp: register,
     }}
    >
  {children}
    </AuthContext.Provider>
  );
    }

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
