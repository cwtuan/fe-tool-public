import { useState, useOptimistic, useActionState } from 'react'
import './App.css'

function ItemList({ items }) {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

async function addItemAction(prevState, formData) {
  await new Promise(r => setTimeout(r, 500))
  const item = formData.get('item')
  if (!item || !item.trim()) {
    return { error: 'Item cannot be empty', items: prevState.items }
  }
  return { error: null, items: [...prevState.items, item] }
}

function App() {
  const [state, formAction] = useActionState(addItemAction, { error: null, items: [] })
  const [optimisticItems, addOptimistic] = useOptimistic(
    state.items,
    (state, newItem) => [...state, newItem]
  )

  const [inputValue, setInputValue] = useState('')

  const handleSubmit = async (formData) => {
    const item = formData.get('item')
    if (item?.trim()) {
      addOptimistic(item)
    }
    setInputValue('')
  }

  return (
    <div className="App">
      <h1>React 19 Simple Demo</h1>
      <form action={formAction} onSubmit={e => { e.preventDefault(); handleSubmit(new FormData(e.target)) }}>
        <input
          name="item"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Add an item..."
        />
        <button type="submit">Add</button>
      </form>
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      <ItemList items={optimisticItems} />
    </div>
  )
}

export default App
