import React, { useState } from 'react';

const dummyCandidates = [
  { name: 'Pranav', year: 'Sophomore', status: 'Pending' },
  { name: 'Marcus', year: 'Junior', status: 'Reviewed' },
  { name: 'Dom', year: 'Senior', status: 'Interviewed' },
];

export default function CandidateList() {
  const [sortKey, setSortKey] = useState('name');

  const sortedCandidates = [...dummyCandidates].sort((a, b) =>
    a[sortKey].localeCompare(b[sortKey])
  );

  return (
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
  );
}