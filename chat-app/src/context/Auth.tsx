import { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import { listenAuth, logoutUser } from "../firebase/auth";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenAuth((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      logout: logoutUser,
    }),
    [currentUser, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <p>Loading...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
