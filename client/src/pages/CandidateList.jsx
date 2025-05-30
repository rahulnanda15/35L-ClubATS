import React, { useState, useEffect } from 'react';

const dummyCandidates = [
  { name: 'Pranav', year: 'Sophomore', status: 'Pending' },
  { name: 'Marcus', year: 'Junior', status: 'Reviewed' },
  { name: 'Dom', year: 'Senior', status: 'Interviewed' },
];

export default function CandidateList() {
  const [sortKey, setSortKey] = useState('name');

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(setMessages)
  }, []);

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
  };

  const sortedCandidates = [...dummyCandidates].sort((a, b) =>
    a[sortKey].localeCompare(b[sortKey])
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Application Messages</h2>
      <form onSubmit={submit} style={{ marginBottom: '1rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a message about applications..."
          style={{
            padding: '0.5rem',
            marginRight: '0.5rem',
            minWidth: '300px'
          }}
        />
        <button type="submit">Send</button>
      </form>

      {messages.length > 0 && (
        <ul style={{
          listStyle: 'none',
          marginBottom: '2rem',
          maxHeight: '200px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '1rem'
        }}>
          {messages.map(m => (
            <li key={m.id} style={{
              margin: '0.5rem 0',
              padding: '0.5rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px'
            }}>
              {m.text}
            </li>
          ))}
        </ul>
      )}

      <hr style={{ margin: '2rem 0' }} />

      <div style={{ padding: '2rem' }}>
        <h1>Candidate List</h1>

        <label>Sort by: </label>
        <select onChange={(e) => setSortKey(e.target.value)} value={sortKey}>
          <option value="name">Name</option>
          <option value="year">Year</option>
          <option value="status">Status</option>
        </select>

        <ul>
          {sortedCandidates.map((candidate, index) => (
            <li key={index} style={{ margin: '1rem 0' }}>
              <strong>{candidate.name}</strong> — {candidate.year}, {candidate.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}