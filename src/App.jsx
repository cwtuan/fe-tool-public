import { useActionState } from 'react'
import './App.css'

async function addMessage(prevState, formData) {
  const message = formData.get('message')
  await new Promise((resolve) => setTimeout(resolve, 800))
  return {
    messages: [...(prevState.messages ?? []), message],
    error: null,
  }
}

function App() {
  const [state, formAction, isPending] = useActionState(addMessage, { messages: [] })

  return (
    <div className="App">
      <h1>React 19 Form Actions Demo</h1>
      <p>
        Uses <code>useActionState</code> with a <code>&lt;form&gt;</code> action.
      </p>
      <form action={formAction}>
        <input
          name="message"
          type="text"
          placeholder="Type a message..."
          required
          aria-label="Message"
        />
        <button type="submit" disabled={isPending} style={{ marginLeft: '10px' }}>
          {isPending ? 'Sending...' : 'Send'}
        </button>
      </form>
      {state.messages.length > 0 && (
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          {state.messages.map((message, i) => (
            <li key={i}>{message}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
