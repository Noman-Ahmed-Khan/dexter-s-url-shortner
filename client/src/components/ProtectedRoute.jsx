import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authcontext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
  return <div className="spinner-container"><div className="spinner"></div></div>;
}
if (!user) {
  return <Navigate to="/login" />;
}


  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
