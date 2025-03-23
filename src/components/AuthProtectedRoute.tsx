import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useFirebase } from '@/lib/firebase/FirebaseContext';

interface AuthProtectedRouteProps {
  children: React.ReactNode;
}

const AuthProtectedRoute: React.FC<AuthProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useFirebase();
  const location = useLocation();

  if (loading) {
    // You could replace this with a loading spinner
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-academic-orange"></div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthProtectedRoute;