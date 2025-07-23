import React from "react";

// PUBLIC_INTERFACE
/**
 * A single Todo item displayed in the task list.
 * @param {Object} props
 * @param {Object} props.todo - The todo object.
 * @param {function} props.onToggle - Function to toggle completion.
 */
function TodoItem({ todo, onToggle }) {
  return (
    <li
      className={`todo-item${todo.is_complete ? " completed" : ""}`}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.75em 1em",
        borderBottom: "1px solid var(--border-color)",
        background: "var(--bg-primary)",
        gap: "1em",
      }}
    >
      <input
        type="checkbox"
        checked={!!todo.is_complete}
        onChange={() => onToggle(todo)}
        aria-label={`Mark ${todo.title} as ${todo.is_complete ? "incomplete" : "complete"}`}
        style={{
          width: 20,
          height: 20,
          accentColor: "#2ED573", // Accent color
        }}
      />
      <span
        style={{
          flexGrow: 1,
          textDecoration: todo.is_complete ? "line-through" : "none",
          color: todo.is_complete
            ? "var(--border-color)"
            : "var(--text-primary)",
          fontWeight: 500,
          fontSize: "1.15em",
          cursor: "default",
          transition: "color 0.2s",
        }}
        data-testid="todo-title"
      >
        {todo.title}
      </span>
      {/* Future edit/delete buttons will go here */}
    </li>
  );
}

export default TodoItem;
