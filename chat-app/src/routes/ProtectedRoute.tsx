import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth";
import Loading from "../components/UI/Loading";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen label="Loading app" />;
  }

  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <Loading fullScreen label="Loading app" />;

  if (currentUser) return <Navigate to="/" replace />;
  return <>{children}</>;
};
