import { useEffect, useState } from 'react'
import CandidateList from './pages/CandidateList';

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(setMessages)
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input }),
    })
    const msg = await res.json()
    setMessages([...messages, msg])
    setInput('')
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Club Application Tracker</h1>

      {/* Original minimal form */}
      <form onSubmit={submit}>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>

      <ul>
        {messages.map(m => <li key={m.id}>{m.text}</li>)}
      </ul>

      {/* Add a line break and new section */}
      <hr style={{ margin: '2rem 0' }} />

      <h2>Candidate List</h2>
      <CandidateList />
    </div>
  );
}