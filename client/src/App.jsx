import { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import CandidateList from './pages/CandidateList';
import Login from './pages/Login';

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  // implemented in order to enable navigation upon login; we can change this to navigate to other pages later if needed
  const navigate = useNavigate()

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
      <div style={{ margin: '1rem 0' }}>
        <button onClick={() => navigate('/login')} style={{ mr: '0.5rem' }}>
          Go to Login
        </button>
        <button onClick={() => navigate('/candidate-list')}>
          Go to Candidate List
        </button>
      </div>

      <Routes>
        <Route
          path="/login"
          element={<Login />}>
        </Route>

        <Route
          path="/candidate-list"
          element={
            <>
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
            </>
          }>
        </Route>
      </Routes>
    </div>
  );
}