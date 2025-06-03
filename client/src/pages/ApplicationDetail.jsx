import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../utils/api';
import AuthenticatedImage from '../components/AuthenticatedImage';
import AuthenticatedFileLink from '../components/AuthenticatedFileLink';

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await apiClient.get(`/applications/${id}`);
        setApplication(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Loading application details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>
        <button onClick={() => navigate('/application-list')}>
          ← Back to Applications
        </button>
      </div>
    );
  }

  if (!application) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>Application not found</div>
        <button onClick={() => navigate('/application-list')}>
          ← Back to Applications
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED': return '#28a745';
      case 'REJECTED': return '#dc3545';
      case 'UNDER_REVIEW': return '#ffc107';
      case 'WAITLISTED': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header with back button */}
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/application-list')}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          ← Back to Applications
        </button>
      </div>

      {/* Main content area */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 200px', 
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left column - Application details */}
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
              {application.firstName} {application.lastName}
            </h1>
            <div style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              backgroundColor: getStatusColor(application.status),
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 'bold'
            }}>
              {application.status}
            </div>
          </div>

          {/* Basic Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
              Basic Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <strong>Email:</strong><br />
                <a href={`mailto:${application.email}`} style={{ color: '#007bff' }}>
                  {application.email}
                </a>
              </div>
              <div>
                <strong>Phone:</strong><br />
                {application.phoneNumber}
              </div>
              <div>
                <strong>Student ID:</strong><br />
                {application.studentId}
              </div>
              <div>
                <strong>Submitted:</strong><br />
                {new Date(application.submittedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
              Academic Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <strong>Graduation Year:</strong><br />
                {application.graduationYear}
              </div>
              <div>
                <strong>Transfer Student:</strong><br />
                {application.isTransferStudent ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Cumulative GPA:</strong><br />
                {application.cumulativeGpa}
              </div>
              <div>
                <strong>Major GPA:</strong><br />
                {application.majorGpa}
              </div>
              <div>
                <strong>Primary Major:</strong><br />
                {application.major1}
              </div>
              {application.major2 && (
                <div>
                  <strong>Secondary Major:</strong><br />
                  {application.major2}
                </div>
              )}
              {application.priorCollegeYears && (
                <div>
                  <strong>Prior College Years:</strong><br />
                  {application.priorCollegeYears}
                </div>
              )}
            </div>
          </div>

          {/* Demographic Information */}
          {(application.gender || application.isFirstGeneration !== null) && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
                Demographic Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {application.gender && (
                  <div>
                    <strong>Gender:</strong><br />
                    {application.gender}
                  </div>
                )}
                {application.isFirstGeneration !== null && (
                  <div>
                    <strong>First Generation:</strong><br />
                    {application.isFirstGeneration ? 'Yes' : 'No'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
              Documents
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {application.resumeUrl && (
                <div>
                  <strong>Resume:</strong><br />
                  <AuthenticatedFileLink
                    href={application.resumeUrl}
                    filename={`${application.firstName}_${application.lastName}_Resume.pdf`}
                    style={{ color: '#007bff' }}
                  >
                    View Resume (PDF)
                  </AuthenticatedFileLink>
                </div>
              )}
              {application.blindResumeUrl && (
                <div>
                  <strong>Blind Resume:</strong><br />
                  <AuthenticatedFileLink
                    href={application.blindResumeUrl}
                    filename={`${application.firstName}_${application.lastName}_Blind_Resume.pdf`}
                    style={{ color: '#007bff' }}
                  >
                    View Blind Resume (PDF)
                  </AuthenticatedFileLink>
                </div>
              )}
              {application.coverLetterUrl && (
                <div>
                  <strong>Cover Letter:</strong><br />
                  <AuthenticatedFileLink
                    href={application.coverLetterUrl}
                    filename={`${application.firstName}_${application.lastName}_Cover_Letter.pdf`}
                    style={{ color: '#007bff' }}
                  >
                    View Cover Letter (PDF)
                  </AuthenticatedFileLink>
                </div>
              )}
              {application.videoUrl && (
                <div>
                  <strong>Video:</strong><br />
                  <AuthenticatedFileLink
                    href={application.videoUrl}
                    filename={`${application.firstName}_${application.lastName}_Video`}
                    style={{ color: '#007bff' }}
                  >
                    View Video
                  </AuthenticatedFileLink>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Headshot */}
        <div style={{ textAlign: 'center' }}>
          {application.headshotUrl ? (
            <div>
              <h4 style={{ marginBottom: '0.5rem' }}>Photo</h4>
              <AuthenticatedImage
                src={application.headshotUrl}
                alt={`${application.firstName} ${application.lastName}`}
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '2px solid #ddd'
                }}
              />
            </div>
          ) : (
            <div>
              <h4 style={{ marginBottom: '0.5rem' }}>Photo</h4>
              <div 
                style={{
                  width: '200px',
                  height: '200px',
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  fontSize: '0.875rem'
                }}
              >
                No photo available
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 