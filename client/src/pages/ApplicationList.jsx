import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../utils/api';

export default function ApplicationList() {
  const [sortKey, setSortKey] = useState('email');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const data = await apiClient.get('/applications');
        setApplicants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const sortedApplicants = [...applicants].sort((a, b) => {
    if (sortKey === 'submittedAt') {
      return new Date(b[sortKey]) - new Date(a[sortKey]);
    }
    return String(a[sortKey]).localeCompare(String(b[sortKey]));
  });

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ padding: '2rem' }}>
        <h1>Candidate List</h1>

        <label>Sort by: </label>
        <select onChange={(e) => setSortKey(e.target.value)} value={sortKey}>
          <option value="email">Email</option>
          <option value="status">Status</option>
          <option value="submittedAt">Submission Date</option>
        </select>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {sortedApplicants.map((applicant) => (
            <li 
              key={applicant.id} 
              style={{ 
                margin: '1rem 0',
              }}
            >
              <Link
                to={`/application/${applicant.id}`}
                style={{
                  display: 'block',
                  padding: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.borderColor = '#007bff';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#ddd';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <strong>{applicant.email}</strong>
                <div>Status: {applicant.status}</div>
                <div>Submitted: {new Date(applicant.submittedAt).toLocaleDateString()}</div>
                <div style={{ 
                  marginTop: '0.5rem', 
                  fontSize: '0.875rem', 
                  color: '#6c757d' 
                }}>
                  Click to view details →
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}