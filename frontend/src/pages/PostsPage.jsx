import { useEffect, useState, useCallback } from 'react';
import { api, cacheApi } from '../api/api';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  // useCallback ensures stable reference
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await cacheApi.get('/posts');
      setPosts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // create post
      const res = await api.post('/posts', { title, content });

      // optimistic update (shows immediately)
      setPosts((prev) => [...prev, res.data]);

      setTitle('');
      setContent('');
      alert('📝 Post created!');

      // re-fetch to make sure cache + server are in sync
      await fetchPosts();
    } catch (err) {
      alert('❌ Error creating post: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={pageContainer}>
      <div style={cardLarge}>
        <h2 style={styles.title}>Posts</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
            required
          />
          <button type="submit" style={styles.button}>
            Create Post
          </button>
        </form>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>⏳ Loading posts...</p>
        ) : posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>No posts yet.</p>
        ) : (
          <ul style={styles.list}>
            {posts.map((p) => (
              <li key={p.id} style={styles.listItem}>
                <h4>{p.title}</h4>
                <p>{p.content}</p>
              </li>
            ))}
          </ul>
        )}
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

const cardLarge = {
  background: 'white',
  padding: '2rem',
  borderRadius: 8,
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  width: '100%',
  maxWidth: 600,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const styles = {
  title: { marginBottom: '1rem', color: '#333', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' },
  input: {
    padding: '0.75rem',
    borderRadius: 6,
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '0.75rem',
    borderRadius: 6,
    border: '1px solid #ccc',
    minHeight: '100px',
    resize: 'vertical', // ✅ allow vertical resize only
    maxWidth: '100%',   // ✅ prevent overflow
    boxSizing: 'border-box',
  },
  button: {
    padding: '0.75rem',
    borderRadius: 6,
    border: 'none',
    background: '#2563eb',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  list: { listStyle: 'none', padding: 0 },
  listItem: {
    border: '1px solid #eee',
    borderRadius: 6,
    padding: '1rem',
    marginBottom: '0.75rem',
    background: '#315675ff',
  },
};
