import { useState } from 'react';
import { api }  from '../api/api';

/**
 * LoginPage Component
 *
 * Description:
 *  - A full-page login form for the application.
 *  - Authenticates the user via the backend Node API (`POST /api/login`).
 *  - Stores JWT token and user info in localStorage upon successful login.
 *  - Redirects the user to the posts page.
 *
 * State:
 *  - email: string — bound to email input field.
 *  - password: string — bound to password input field.
 *
 * Behavior:
 *  - On form submission:
 *      1. Prevents default form submission.
 *      2. Calls `api.post('/login', { email, password })`.
 *      3. If successful:
 *          - Saves JWT token to `localStorage` under key `token`.
 *          - Saves user info to `localStorage` under key `user`.
 *          - Redirects browser to `/posts`.
 *      4. If failure:
 *          - Displays an alert with error message from response or fallback message.
 *
 * API Call:
 *  - Endpoint: POST /api/login
 *  - Payload: { email: string, password: string }
 *  - Response: { token: string, user: object }
 *
 * UI Elements:
 *  - Email input (controlled)
 *  - Password input (controlled)
 *  - Submit button
 *
 * Styles:
 *  - Full-page dark background container (flex-centered)
 *  - White card with padding, rounded corners, shadow
 *  - Inputs with padding, border-radius, and border
 *  - Button with primary color, bold text, pointer cursor
 *
 * Usage:
 *  - No props required.
 *  - Simply render: <LoginPage />
 *
 * Notes:
 *  - All state and form logic is handled internally.
 *  - No external libraries other than `api` for HTTP request.
 *  - Redirect uses `window.location.href` (can be swapped to `useNavigate` if using React Router).
 */

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await api.post('/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        window.location.href = '/posts';
    } catch (err) {
        alert('Login failed: ' + (err.response?.data?.error || err.message));
    }
    };



  return (
    <div style={pageContainer}>
      <div style={card}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

const pageContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  width: '100vw',
  background: '#1e1e1e',
};

const card = {
  background: 'white',
  padding: '2rem',
  borderRadius: 8,
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  width: '100%',
  maxWidth: 400,
};

const styles = {
  title: { marginBottom: '1rem', color: '#333', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input: { padding: '0.75rem', borderRadius: 6, border: '1px solid #ccc' },
  button: {
    padding: '0.75rem',
    borderRadius: 6,
    border: 'none',
    background: '#4f46e5',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
