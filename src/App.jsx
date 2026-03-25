import { useState, use } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const fetchData = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.3
        if (success) {
          resolve({ message: 'React 19 use() hook demo - Data loaded successfully!', timestamp: new Date().toLocaleTimeString() })
        } else {
          reject(new Error('Random failure occurred'))
        }
      }, 1000)
    })
    return promise
  }

  const promise = data ? Promise.resolve(data) : error ? Promise.reject(error) : fetchData()

  return (
    <div className="App">
      <h1>React 19 use() Hook Demo</h1>
      <button onClick={() => { setData(null); setError(null) }}>Refresh</button>
      <div>
        {use(promise)}
      </div>
    </div>
  )
}

export default App
