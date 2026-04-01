import { useState, use } from 'react'
import './App.css'

const ThemeContext = React.createContext('light')

function App() {
  const [theme, setTheme] = useState('light')

  return (
    <ThemeContext.Provider value={theme}>
      <div className="App">
        <h1>React 19 use() Hook Demo</h1>
        <ThemeDisplay />
        <Greeting promise={fetchData()} />
        <div>
          <button onClick={() => setTheme('light')}>Light</button>
          <button onClick={() => setTheme('dark')}>Dark</button>
        </div>
      </div>
    </ThemeContext.Provider>
  )
}

function ThemeDisplay() {
  const theme = use(ThemeContext)
  return <p>Current theme via use(): {theme}</p>
}

function Greeting({ promise }) {
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

const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: 'Hello from React 19 use() hook!',
        timestamp: new Date().toLocaleTimeString(),
        features: ['Read promises in render', 'Read context with use()', 'New concurrent features']
      })
    }, 500)
  })
}

export default App