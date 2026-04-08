import { useState, use, useOptimistic, useTransition } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [items, setItems] = useState(
    Array.from({ length: 100 }, (_, i) => ({ id: i + 1, text: `Item ${i + 1}`, liked: false }))
  )
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state, newItem) => [...state, newItem]
  )

  const filteredItems = optimisticItems.filter(item =>
    item.text.toLowerCase().includes(query.toLowerCase())
  )

  const handleChange = (e) => {
    startTransition(() => {
      setQuery(e.target.value)
    })
  }

  const addItem = async () => {
    const newId = items.length + 1
    const newItem = { id: newId, text: `Item ${newId}`, liked: false, pending: true }
    addOptimisticItem(newItem)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setItems(prev => [...prev, { ...newItem, pending: false }])
  }

  const toggleLike = (id) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, liked: !item.liked } : item
      )
    )
  }

  return (
    <div className="App">
      <h1>React 19 Features Demo</h1>
      <p>Features: useOptimistic, useTransition</p>
      <div>
        <label>Search: </label>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Filter items..."
        />
        <button onClick={addItem} style={{ marginLeft: '10px' }}>
          Add Item (Optimistic)
        </button>
      </div>
      {isPending && <p>Updating...</p>}
      <ul style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {filteredItems.slice(0, 50).map((item) => (
          <li key={item.id} style={{ opacity: item.pending ? 0.5 : 1 }}>
            <span>{item.text}</span>
            <button onClick={() => toggleLike(item.id)} style={{ marginLeft: '10px' }}>
              {item.liked ? '❤️' : '🤍'}
            </button>
            {item.pending && <span style={{ marginLeft: '10px', color: 'blue' }}>Adding...</span>}
          </li>
        ))}
      </ul>
      <p>Total matches: {filteredItems.length}</p>
    </div>
  )
}

export default App