import { useReducer, useState } from 'react'
import './App.css'

const ACTIONS = {
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  DELETE_TODO: 'DELETE_TODO',
}

function reducer(todos, action) {
  switch (action.type) {
    case ACTIONS.ADD_TODO:
      return [...todos, { text: action.payload, completed: false }]
    case ACTIONS.TOGGLE_TODO:
      return todos.map((todo, index) =>
        index === action.payload ? { ...todo, completed: !todo.completed } : todo
      )
    case ACTIONS.DELETE_TODO:
      return todos.filter((_, index) => index !== action.payload)
    default:
      return todos
  }
}

function App() {
  const [todos, dispatch] = useReducer(reducer, [])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (input.trim()) {
      dispatch({ type: ACTIONS.ADD_TODO, payload: input })
      setInput('')
    }
  }

  return (
    <div className="App">
      <h1>Todo List (useReducer Demo)</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.text}
            <button onClick={() => dispatch({ type: ACTIONS.TOGGLE_TODO, payload: index })}>Toggle</button>
            <button onClick={() => dispatch({ type: ACTIONS.DELETE_TODO, payload: index })}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App