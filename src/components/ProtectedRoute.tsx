import { Navigate } from "react-router-dom";
import { useAuth, type UserRole } from "@/lib/AuthContext";

export default function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: UserRole }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === "employer" ? "/employer-dashboard" : "/dashboard"} replace />;
  }

  return <>{children}</>;
}
