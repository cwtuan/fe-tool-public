import { useState, useId, useTransition } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const id = useId()

  const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`)

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  )

  const handleChange = (e) => {
    startTransition(() => {
      setQuery(e.target.value)
    })
  }

  return (
    <div className="App">
      <h1>React 18 Features Demo</h1>
      <div>
        <label htmlFor={id}>Search items: </label>
        <input
          id={id}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Type to filter..."
        />
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
    </div>
  )
}

export default App