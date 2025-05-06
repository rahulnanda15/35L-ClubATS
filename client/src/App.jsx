import { useEffect, useState } from 'react'

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
    <div>
      <form onSubmit={submit}>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map(m => <li key={m.id}>{m.text}</li>)}
      </ul>
    </div>
  )
}