import { useState, useId, useTransition, use, useOptimistic } from 'react'
import './App.css'

function ResourceDisplay({ resource }) {
  const data = use(resource)
  return <p>Loaded: {data}</p>
}

function createResource(value) {
  let status = 'pending'
  let result
  const promise = new Promise((resolve) =>
    setTimeout(() => {
      status = 'success'
      result = `Data for "${value}" fetched at ${new Date().toLocaleTimeString()}`
      resolve()
    }, 500)
  )
  return {
    read() {
      if (status === 'pending') throw promise
      if (status === 'success') return result
    }
  }
}

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React 19', done: false },
    { id: 2, text: 'Try useOptimistic', done: false },
  ])
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { id: Date.now(), text: newTodo, done: false }]
  )

  const handleSubmit = async (formData) => {
    const text = formData.get('todo')
    if (!text) return
    addOptimisticTodo(text)
    await new Promise(r => setTimeout(r, 300))
    setTodos(prev => [...prev, { id: Date.now(), text, done: false }])
  }

  return (
    <div>
      <h2>Todo List (useOptimistic)</h2>
      <form action={handleSubmit}>
        <input name="todo" placeholder="Add a todo..." />
        <button type="submit">Add</button>
      </form>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id}>
            <input type="checkbox" defaultChecked={todo.done} />
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const id = useId()
  const [resource, setResource] = useState(null)

  const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`)

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  )

  const handleChange = (e) => {
    startTransition(() => {
      setQuery(e.target.value)
    })
  }

  const handleFetch = () => {
    startTransition(() => {
      setResource(createResource(query || 'default'))
    })
  }

  return (
    <div className="App">
      <h1>React 19 Features Demo</h1>
      <div>
        <label htmlFor={id}>Search items: </label>
        <input
          id={id}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Type to filter..."
        />
        <button onClick={handleFetch} style={{ marginLeft: '10px' }}>
          Fetch Data
        </button>
        <label htmlFor={`${id}-checkbox`} style={{ marginLeft: '20px' }}>
          <input id={`${id}-checkbox`} type="checkbox" />
          Option {id}
        </label>
      </div>
      {isPending ? (
        <p>Loading...</p>
      ) : (
        <ul style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {filteredItems.slice(0, 50).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      <p>Total matches: {filteredItems.length}</p>
      {resource && <ResourceDisplay resource={resource} />}
      <TodoList />
    </div>
  )
}

export default App