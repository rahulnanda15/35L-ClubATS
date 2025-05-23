import React, { useState } from 'react';

function ApplicationCycleManager() {
  const [cycles, setCycles] = useState([
    { id: 1, name: 'Fall 2023', active: false },
    { id: 2, name: 'Spring 2024', active: true },
  ]);

  const [newCycleName, setNewCycleName] = useState('');

  const handleAddCycle = () => {
    if (!newCycleName.trim()) return;
    const newCycle = {
      id: cycles.length + 1,
      name: newCycleName,
      active: false,
    };
    setCycles([...cycles, newCycle]);
    setNewCycleName('');
  };

  const toggleActive = (id) => {
    setCycles(cycles.map(cycle =>
      cycle.id === id ? { ...cycle, active: !cycle.active } : cycle
    ));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📅 Application Cycles</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="New cycle name"
          value={newCycleName}
          onChange={(e) => setNewCycleName(e.target.value)}
        />
        <button onClick={handleAddCycle} style={{ marginLeft: '0.5rem' }}>
          Add Cycle
        </button>
      </div>

      <ul>
        {cycles.map((cycle) => (
          <li key={cycle.id} style={{ marginBottom: '0.5rem' }}>
            <strong>{cycle.name}</strong> — Status:{" "}
            <span style={{ color: cycle.active ? 'green' : 'gray' }}>
              {cycle.active ? 'Active' : 'Inactive'}
            </span>
            <button
              onClick={() => toggleActive(cycle.id)}
              style={{ marginLeft: '1rem' }}
            >
              {cycle.active ? 'Deactivate' : 'Activate'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ApplicationCycleManager;