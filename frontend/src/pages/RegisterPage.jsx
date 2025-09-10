import { useState } from 'react';
import { api } from '../api/api';
/**
 * RegisterPage Component
 *
 * This component renders a registration form for new users.
 * 
 * Features:
 * - Collects user input for name, email, and password.
 * - Submits registration data to the backend via `api.post('/register')`.
 * - Alerts the user upon success or failure.
 * - Redirects to the login page after successful registration.
 *
 * State:
 * - name: current input value for the user's name.
 * - email: current input value for the user's email.
 * - password: current input value for the user's password.
 *
 * UI:
 * - Styled centered card layout.
 * - Form with three input fields: name, email, password.
 * - Submit button labeled "Sign Up".
 * - Alerts user for success or error messages.
 *
 * Example usage:
 * ```jsx
 * <RegisterPage />
 * ```
 */

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register', { name, email, password });
      alert('Registered successfully! Please log in.');
      window.location.href = '/login';
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={pageContainer}>
      <div style={card}>
        <h2 style={styles.title}>Register</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
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
          <button type="submit" style={{ ...styles.button, background: '#16a34a' }}>
            Sign Up
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
