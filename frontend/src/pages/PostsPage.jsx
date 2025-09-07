import { useEffect, useState, useCallback, useRef } from 'react';
import { api, cacheApi } from '../api/api';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const textareaRef = useRef(null);

  // Fetch posts from backend
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);

      const res = await cacheApi.get('/posts');

      const postsArray = Array.isArray(res?.data) ? res.data : [];
      const validPosts = postsArray.filter(
        (p) => p && p.id && p.title && p.username && p.createdAt
      );

      // Sort newest first
      validPosts.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setPosts(validPosts);
    } catch (err) {
      console.error('Failed to fetch posts:', err.response?.data || err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Auto-resize textarea
  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const tempId = Date.now();
    const tempPost = {
      id: tempId,
      title,
      content,
      username: 'You',
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setPosts((prev) => [tempPost, ...prev]);
    setTitle('');
    setContent('');

    try {
      const res = await api.post('/posts', { title, content });

      // Normalize server response
      const serverPost = {
        id: res.data.id,
        title: res.data.title,
        content: res.data.content,
        username: res.data.user?.name || 'Unknown',
        createdAt: res.data.created_at || res.data.createdAt || new Date().toISOString(),
      };

      // Replace temporary post
      setPosts((prev) => prev.map((p) => (p.id === tempId ? serverPost : p)));

      alert('Post created successfully!');
    } catch (err) {
      // Remove temp post on error
      setPosts((prev) => prev.filter((p) => p.id !== tempId));
      alert('Error creating post: ' + (err.response?.data?.error || err.message));
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
            ref={textareaRef}
            placeholder="Content"
            value={content}
            onChange={handleContentChange}
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
                <small>
                  Posted by: {p.username}, Date: {new Date(p.createdAt).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Styles
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
  input: { padding: '0.75rem', borderRadius: 6, border: '1px solid #ccc' },
  textarea: {
    padding: '0.75rem',
    borderRadius: 6,
    border: '1px solid #ccc',
    minHeight: '100px',
    resize: 'none', // auto-resize handled by JS
    overflow: 'hidden',
    maxWidth: '100%',
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
    color: 'white',
  },
};
