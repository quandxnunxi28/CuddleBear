import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/ui/Loading';

function RoleRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleRoute;
