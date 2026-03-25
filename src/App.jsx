import { useState, useTransition } from 'react'
import './App.css'

const ITEMS = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`)

function App() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [filteredItems, setFilteredItems] = useState(ITEMS)

  const handleSearch = (e) => {
    const value = e.target.value
    setQuery(value)
    startTransition(() => {
      const matches = ITEMS.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredItems(matches)
    })
  }

  return (
    <div className="App">
      <h1>React useTransition Demo</h1>
      <p>Search through 10,000 items (non-blocking update)</p>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search items..."
      />
      {isPending && <p>Updating...</p>}
      <ul style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {filteredItems.slice(0, 100).map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <p>Showing {Math.min(filteredItems.length, 100)} of {filteredItems.length} results</p>
    </div>
  )
}

export default App