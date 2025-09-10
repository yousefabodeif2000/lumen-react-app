import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostsPage from './pages/PostsPage';
import ProtectedRoute from './ProtectedRoute';
/**
 * App Component
 *
 * The main entry point for the React frontend.
 *
 * Features:
 * - Provides routing between LoginPage, RegisterPage, and PostsPage using React Router.
 * - Displays a top navigation bar (NavBar) with links and user greeting.
 * - Handles login state via localStorage token.
 * - Protects the /posts route using ProtectedRoute.
 * - Automatically updates login state every 500ms to reflect token changes.
 *
 * Components:
 * - NavBar: Shows links to Login, Register, Posts; displays username when logged in; includes Logout button.
 * - Routes:
 *   - /login → LoginPage
 *   - /register → RegisterPage
 *   - /posts → PostsPage (protected)
 *
 * State:
 * - isLoggedIn: boolean indicating whether a user is logged in.
 *
 * Example usage:
 * ```jsx
 * <App />
 * ```
 *
 * Notes:
 * - Login and registration tokens are stored in localStorage.
 * - NavBar updates dynamically based on login state.
 */

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));


  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    }, 500);
    return () => clearInterval(interval);
  }, []);
const user = isLoggedIn ? JSON.parse(localStorage.getItem('user') || '{}') : null;

{isLoggedIn && (
  <span style={styles.greeting}>Hi, {user?.name || 'User'}!</span>
)}
  return (
    <BrowserRouter>
      <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div style={{ paddingTop: '4rem' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <PostsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function NavBar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const user = isLoggedIn ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/login" style={styles.link}>Login</Link>
      <Link to="/register" style={styles.link}>Register</Link>
      {isLoggedIn ? (
        <>
          <Link to="/posts" style={styles.link}>Posts</Link>
          <span style={styles.greeting}>Hi, {user?.name || 'User'}!</span>
          <button onClick={handleLogout} style={styles.logout}>Logout</button>
        </>
      ) : (
        <span style={styles.disabled}>Posts</span>
      )}
    </nav>
  );
}


const styles = {
  nav: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    background: '#111',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  link: {
    color: '#60a5fa',
    textDecoration: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  disabled: {
    color: '#666',
    fontWeight: 'bold',
    cursor: 'not-allowed',
  },
  logout: {
    marginLeft: 'auto',
    padding: '0.4rem 0.8rem',
    borderRadius: 6,
    border: 'none',
    background: '#dc2626',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default App;
