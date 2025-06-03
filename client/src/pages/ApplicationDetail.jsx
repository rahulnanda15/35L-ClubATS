import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, DocumentIcon } from '@heroicons/react/24/outline';
import apiClient from '../utils/api';
import AuthenticatedImage from '../components/AuthenticatedImage';
import AuthenticatedFileLink from '../components/AuthenticatedFileLink';
import '../styles/ApplicationDetail.css';

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
      <div className="application-detail">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          Loading application details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="application-detail">
        <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>
        <Link to="/application-list" className="back-link">
          <ArrowLeftIcon className="back-icon" />
          Back to Applications
        </Link>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="application-detail">
        <div style={{ marginBottom: '1rem' }}>Application not found</div>
        <Link to="/application-list" className="back-link">
          <ArrowLeftIcon className="back-icon" />
          Back to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="application-detail">
      {/* Header with back button and status */}
      <div className="detail-header">
        <div className="header-left">
          <Link to="/application-list" className="back-link">
            <ArrowLeftIcon className="back-icon" />
            Back to Applications
          </Link>
          <div className="name-and-status">
            <h1 className="candidate-name">
              {application.firstName} {application.lastName}
            </h1>
            <div className={`status-badge ${application.status.toLowerCase()}`}>
              {application.status.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="detail-content">
        {/* Left column - Application details */}
        <div className="detail-main">
          {/* Basic Information */}
          <div className="info-section">
            <h2 className="section-title">Basic Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">
                  <a href={`mailto:${application.email}`}>{application.email}</a>
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone</span>
                <span className="info-value">{application.phoneNumber}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Student ID</span>
                <span className="info-value">{application.studentId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Submitted</span>
                <span className="info-value">
                  {new Date(application.submittedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="info-section">
            <h2 className="section-title">Academic Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Graduation Year</span>
                <span className="info-value">{application.graduationYear}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Transfer Student</span>
                <span className="info-value">
                  {application.isTransferStudent ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Cumulative GPA</span>
                <span className="info-value">{application.cumulativeGpa}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Major GPA</span>
                <span className="info-value">{application.majorGpa}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Primary Major</span>
                <span className="info-value">{application.major1}</span>
              </div>
              {application.major2 && (
                <div className="info-item">
                  <span className="info-label">Secondary Major</span>
                  <span className="info-value">{application.major2}</span>
                </div>
              )}
              {application.priorCollegeYears && (
                <div className="info-item">
                  <span className="info-label">Prior College Years</span>
                  <span className="info-value">{application.priorCollegeYears}</span>
                </div>
              )}
            </div>
          </div>

          {/* Demographic Information */}
          {(application.gender || application.isFirstGeneration !== null) && (
            <div className="info-section">
              <h2 className="section-title">Demographic Information</h2>
              <div className="info-grid">
                {application.gender && (
                  <div className="info-item">
                    <span className="info-label">Gender</span>
                    <span className="info-value">{application.gender}</span>
                  </div>
                )}
                {application.isFirstGeneration !== null && (
                  <div className="info-item">
                    <span className="info-label">First Generation</span>
                    <span className="info-value">
                      {application.isFirstGeneration ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="info-section">
            <h2 className="section-title">Documents</h2>
            <div className="info-grid">
              {application.resumeUrl && (
                <div className="info-item">
                  <AuthenticatedFileLink
                    href={application.resumeUrl}
                    filename={`${application.firstName}_${application.lastName}_Resume.pdf`}
                    className="document-link"
                  >
                    <DocumentIcon className="document-icon" />
                    Resume (PDF)
                  </AuthenticatedFileLink>
                </div>
              )}
              {application.blindResumeUrl && (
                <div className="info-item">
                  <AuthenticatedFileLink
                    href={application.blindResumeUrl}
                    filename={`${application.firstName}_${application.lastName}_Blind_Resume.pdf`}
                    className="document-link"
                  >
                    <DocumentIcon className="document-icon" />
                    Blind Resume (PDF)
                  </AuthenticatedFileLink>
                </div>
              )}
              {application.coverLetterUrl && (
                <div className="info-item">
                  <AuthenticatedFileLink
                    href={application.coverLetterUrl}
                    filename={`${application.firstName}_${application.lastName}_Cover_Letter.pdf`}
                    className="document-link"
                  >
                    <DocumentIcon className="document-icon" />
                    Cover Letter (PDF)
                  </AuthenticatedFileLink>
                </div>
              )}
              {application.videoUrl && (
                <div className="info-item">
                  <AuthenticatedFileLink
                    href={application.videoUrl}
                    filename={`${application.firstName}_${application.lastName}_Video`}
                    className="document-link"
                  >
                    <DocumentIcon className="document-icon" />
                    Video
                  </AuthenticatedFileLink>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Photo */}
        <div className="detail-sidebar">
          <div className="candidate-photo">
            <h3 className="photo-title">Photo</h3>
            {application.headshotUrl ? (
              <AuthenticatedImage
                src={application.headshotUrl}
                alt={`${application.firstName} ${application.lastName}`}
                className="photo-image"
              />
            ) : (
              <div className="photo-placeholder">
                No photo available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 