import { useState, use } from 'react'
import './App.css'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: 'Hello from React 19 use() hook!',
          timestamp: new Date().toLocaleTimeString(),
          features: ['Read promises in render', 'Read context directly', 'Cleaner async patterns']
        })
      }, 1000)
    })
  }

  const dataPromise = fetchData()

  return (
    <div className="App">
      <h1>React 19 use() Hook Demo</h1>
      <Message promise={dataPromise} />
      <button onClick={() => setRefreshKey(k => k + 1)}>
        Refresh
      </button>
    </div>
  )
}

function Message({ promise }) {
  const data = use(promise)
  
  return (
    <div>
      <p>{data.message}</p>
      <p>Time: {data.timestamp}</p>
      <ul>
        {data.features.map((feature, i) => (
          <li key={i}>{feature}</li>
        ))}
      </ul>
    </div>
  )
}

export default App