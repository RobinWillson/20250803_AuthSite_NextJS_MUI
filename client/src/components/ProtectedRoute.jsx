import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * A component that checks if a user is authenticated before rendering a route.
 * If the user is not authenticated, it redirects them to the login page.
 */
function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to the login page, but save the current location the user was
    // trying to go to. This allows us to redirect them back after login.
    return <Navigate to="/login" state={ { from: location } } replace />;
  }

  // If authenticated, render the child route element via the Outlet.
  return <Outlet />;
}

export default ProtectedRoute;