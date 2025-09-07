import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostsPage from './pages/PostsPage';
import ProtectedRoute from './ProtectedRoute';

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
