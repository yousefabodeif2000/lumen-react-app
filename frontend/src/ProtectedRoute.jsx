import { Navigate } from 'react-router-dom';
/**
 * ProtectedRoute Component
 *
 * A higher-order route wrapper that restricts access to authenticated users.
 *
 * Props:
 * - children: React elements that should only render if the user is authenticated.
 *
 * Behavior:
 * - Checks for a token in localStorage.
 * - If a token exists, renders the children normally.
 * - If no token is found, redirects the user to the /login page using React Router's <Navigate /> component.
 *
 * Example usage:
 * ```jsx
 * <ProtectedRoute>
 *   <PostsPage />
 * </ProtectedRoute>
 * ```
 *
 * Notes:
 * - This component does not verify the token with the backend; it only checks localStorage.
 * - Used in conjunction with App.jsx to protect private routes.
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
