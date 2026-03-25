import { useState, useId } from 'react'
import './App.css'

function App() {
  const [items, setItems] = useState([])
  const [input, setInput] = useState('')
  const id = useId()

  const addItem = () => {
    if (input.trim()) {
      setItems([...items, { id: `${id}-${Date.now()}`, text: input, completed: false }])
      setInput('')
    }
  }

  const toggleItem = (itemId) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ))
  }

  const deleteItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId))
  }

  return (
    <div className="App">
      <h1>React 18 useId Demo</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add item"
      />
      <button onClick={addItem}>Add</button>
      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
            {item.text}
            <button onClick={() => toggleItem(item.id)}>Toggle</button>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App