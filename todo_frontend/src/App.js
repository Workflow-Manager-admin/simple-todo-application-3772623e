import React, { useState, useEffect } from 'react';
import './App.css';
import supabase from './supabaseClient';
import TodoItem from './TodoItem';

// PUBLIC_INTERFACE
/**
 * The main Todo App component.
 * - Connects to Supabase to fetch/add/update todos
 * - Renders: Header, Task List, Add Todo Input
 */
function App() {
  const [theme, setTheme] = useState('light');
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch todos from Supabase on load
  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  async function fetchTodos() {
    setLoading(true);
    setErrorMsg('');
    try {
      // Table name: todos; fields: id, title, is_complete, created_at
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (err) {
      setErrorMsg('Failed to load tasks.');
    }
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  async function addTodo(e) {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ title, is_complete: false }])
        .select();

      if (error) throw error;
      setTodos((prev) => [...data, ...prev]);
      setInput('');
    } catch (err) {
      setErrorMsg('Could not add todo.');
    }
  }

  // PUBLIC_INTERFACE
  async function handleToggle(todo) {
    // Update is_complete in Supabase and state
    setErrorMsg('');
    try {
      const { error } = await supabase
        .from('todos')
        .update({ is_complete: !todo.is_complete })
        .eq('id', todo.id);

      if (error) throw error;
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todo.id ? { ...t, is_complete: !t.is_complete } : t
        )
      );
    } catch (err) {
      setErrorMsg('Failed to update task.');
    }
  }

  return (
    <div className="App">
      <header className="App-header" style={{
        minHeight: 0,
        padding: '3rem 0 1rem 0',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <h1 style={{
          color: '#4F8EF7',
          fontSize: '2.3rem',
          margin: 0,
          fontWeight: 700,
          letterSpacing: '.02em',
        }}>Todo App</h1>
        <p style={{
          color: '#F7B32B',
          fontSize: '1.05rem',
          fontWeight: 400,
          letterSpacing: '.03em',
          margin: '0.5em 0 0 0'
        }}>
          Manage your tasks efficiently. Simple, modern, and minimalistic.
        </p>
      </header>

      <main style={{
        maxWidth: 520,
        margin: '2.5rem auto 0 auto',
        background: 'var(--bg-primary)',
        borderRadius: 14,
        boxShadow: '0 4px 32px rgba(79,142,247,0.05)',
        padding: '2.3em 1.3em 1.5em 1.3em',
        border: '1.5px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.3em'
      }}>
        <form
          onSubmit={addTodo}
          style={{
            display: 'flex',
            gap: '1em',
            alignItems: 'center',
            marginBottom: '0.5em'
          }}
          aria-label="Add new todo"
        >
          <input
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{
              flex: 1,
              background: "var(--bg-secondary)",
              border: "1px solid #2ED573",
              borderRadius: 8,
              padding: "0.75em 1.2em",
              fontSize: "1.10em",
              outline: "none",
              color: "var(--text-primary)",
              fontWeight: 400,
              transition: 'border-color 0.25s',
            }}
            aria-label="New todo"
            autoFocus
            maxLength={100}
          />
          <button
            type="submit"
            className="btn"
            style={{
              background: "#2ED573",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "0.77em 1.4em",
              fontWeight: 600,
              fontSize: "1.05em",
              cursor: "pointer",
              transition: 'background 0.2s'
            }}
            aria-label="Add todo"
            disabled={!input.trim()}
          >
            Add
          </button>
        </form>
        {errorMsg && (
          <div style={{
            color: "red",
            textAlign: "center",
            margin: "0.25em 0 0.6em 0",
            fontSize: "0.97em"
          }}>
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div style={{ color: "#4F8EF7", textAlign: "center", marginTop: 40 }}>
            Loading tasks...
          </div>
        ) : (
          <ul style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            minHeight: 60
          }}>
            {todos.length === 0 && (
              <li style={{
                color: "#aaa",
                textAlign: "center",
                fontStyle: "italic",
                padding: "2em 0",
              }}>
                No tasks yet. Add your first todo!
              </li>
            )}
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
              />
            ))}
          </ul>
        )}
      </main>
      <footer style={{
        margin: "2.5rem 0 1.2rem 0",
        textAlign: "center",
        color: "var(--border-color)",
        fontSize: "0.93em"
      }}>
        Powered by{' '}
        <a href="https://supabase.com" style={{ color: '#4F8EF7', textDecoration: 'none' }}>
          Supabase
        </a>
        {' '}| Minimal React Todo © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
