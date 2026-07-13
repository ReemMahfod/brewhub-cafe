import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth.js';

export default function RequireAuth({ children }) {
  const loc = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  return children;
}
