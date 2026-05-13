import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth";
import Loading from "../components/UI/Loading";

const AuthGuard = ({ children, isPublic }: { children: ReactNode; isPublic?: boolean }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <Loading fullScreen label="Loading app" />;
  if (isPublic) return currentUser ? <Navigate to="/" replace /> : <>{children}</>;
  return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
};

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  return <AuthGuard isPublic>{children}</AuthGuard>;
};
