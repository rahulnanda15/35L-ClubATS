import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Stack,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    Snackbar,
    TextField,
    CircularProgress
} from '@mui/material';
import {
    Edit as EditIcon,
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
    SkipNext as SkipNextIcon,
    Refresh as RefreshIcon,
    Refresh
} from '@mui/icons-material';

const adminAPI = {
    async fetchStats() {
        try {
            const response = await fetch('/api/admin/stats');
            if (!response.ok) throw new Error('Failed to fetch stats');
            return await response.json();
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    },

    async fetchCandidates() {
        try {
            const response = await fetch('/api/admin/candidates');
            return await response.json();
        } catch (error) {
            console.error('Error fetching candidates: ', error);
            throw error;
        }
    },

    async updateApproval(candidateId, approved) {
        try {
            const response = await fetch(`/api/admin/candidates/${candidateId}/approval`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ approved }),
            });

            if (!response.ok) throw new Error('Failed to update approval');
            return await response.json();
        } catch (error) {
            console.error('Error updating approval: ', error);
            throw error;
        }
    },

    async advanceRound() {
        try {
            const response = await fetch('/api/admin/advance-round', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to advance round');
            return await response.json();
        } catch (error) {
            console.error('Error advancing round: ', error);
            throw error;
        }
    },

    // Advance individual candidate
    async advanceCandidate(candidateId) {
        try {
            const response = await fetch(`/api/admin/advance-candidate/${candidateId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to advance candidate');
            return await response.json();
        } catch (error) {
            console.error('Error advancing candidate:', error);
            throw error;
        }
    },

    // Reject individual candidate
    async rejectCandidate(candidateId) {
        try {
            const response = await fetch(`/api/admin/reject-candidate/${candidateId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to reject candidate');
            return await response.json();
        } catch (error) {
            console.error('Error rejecting candidate:', error);
            throw error;
        }
    },

    // Update individual candidate
    async updateCandidate(candidateId, updateData) {
        try {
            const response = await fetch(`/api/admin/candidates/${candidateId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) throw new Error('Failed to update candidate');
            return await response.json();
        } catch (error) {
            console.error('Error updating candidate:', error);
            throw error;
        }
    },

    async resetAll() {
        try {
            const response = await fetch('/api/admin/reset-all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to reset candidates');
            return await response.json();
        } catch (error) {
            console.error('Error resetting candidates: ', error);
            throw error;
        }
    },
};

const rounds = [
    { key: 'SUBMITTED', name: 'Submitted', next: 'UNDER_REVIEW' },
    { key: 'UNDER_REVIEW', name: 'Under Review', next: 'ACCEPTED' },
    { key: 'ACCEPTED', name: 'Accepted', next: null },
    { key: 'REJECTED', name: 'Rejected', next: null },
    { key: 'WAITLISTED', name: 'Waitlisted', next: 'UNDER_REVIEW' }
];

const mockCandidates = [
    { id: 1, name: 'Pranav Kunnath', email: 'pranav@email.com', status: 'Interview Round 1', score: 85, currentRound: 'interview1', approved: null, submittedAt: '2025-01-15' },
    { id: 2, name: 'Ronit Anilkumar', email: 'ronit@email.com', status: 'Resume Review', score: 92, currentRound: 'resume', approved: true, submittedAt: '2025-01-14' },
    { id: 3, name: 'Jishan Kharbanda', email: 'jishan@email.com', status: 'Final Decision', score: 78, currentRound: 'final', approved: false, submittedAt: '2025-01-13' },
    { id: 4, name: 'Jackson Bae', email: 'jackson@email.com', status: 'Interview Round 2', score: 88, currentRound: 'interview2', approved: null, submittedAt: '2025-01-12' }
];

const mockStats = {
    totalApplicants: 187,
    tasks: 12,
    candidates: 45,
    currentRound: 'interview1'
};

const StatusIndicator = ({ status }) => {
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Submitted':
                return {
                    color: '#1976d2',
                    backgroundColor: '#e3f2fd',
                    borderColor: '#1976d2',
                    '&:hover': {
                        backgroundColor: '#bbdefb',
                        transform: 'scale(1.05)'
                    }
                };
            case 'Under Review':
                return {
                    color: '#0288d1',
                    backgroundColor: '#e1f5fe',
                    borderColor: '#0288d1'
                };
            case 'Accepted':
                return {
                    color: '#2e7d32',
                    backgroundColor: '#e8f5e8',
                    borderColor: '#2e7d32'
                };
            case 'Rejected':
                return {
                    color: '#d32f2f',
                    backgroundColor: '#ffebee',
                    borderColor: '#d32f2f'
                };
            case 'Waitlisted':
                return {
                    color: '#f57c00',
                    backgroundColor: '#fff3e0',
                    borderColor: '#f57c00'
                };
            default:
                return {
                    color: '#757575',
                    backgroundColor: '#f5f5f5',
                    borderColor: '#757575'
                };
        }
    };

    const statusStyles = getStatusStyles(status);

    return (
        <Chip
            label={status}
            size="small"
            sx={{
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 600,
                borderRadius: '40px',
                border: '2px solid',
                px: 1.5,
                py: 0.5,
                height: '36px',
                minWidth: '100px',
                transition: 'all 0.2s ease-in-out',
                cursor: 'default',
                ...statusStyles,
                '& .MuiChip-label': {
                    paddingLeft: '8px',
                    paddingRight: '8px',
                    fontSize: '0.875rem',
                    letterSpacing: '0.02em',
                    fontWeight: 600
                }
            }}
        />
    );
};

const ApprovalIndicator = ({ approved, onApprovalChange, isDisabled = false, isWaitlisted = false }) => {
    if (isDisabled) {
        if (approved === true) {
            return (
                <Chip
                    icon={<ThumbUpIcon />}
                    label="Final Decision"
                    color="success"
                    size="small"
                    sx={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        fontWeight: 500,
                        borderRadius: '40px',
                        border: '1px solid',
                        color: 'white',
                        borderColor: 'success.main',
                        height: '32px',
                        minWidth: '110px',
                        px: 1,
                        '& .MuiChip-icon': {
                            marginLeft: '8px',
                            color: 'white'
                        },
                        '& .MuiChip-label': {
                            paddingLeft: '8px',
                            paddingRight: '8px'
                        }
                    }}
                />
            );
        } else if (approved === false) {
            return (
                <Chip
                    icon={<ThumbDownIcon />}
                    label="Final Decision"
                    color="error"
                    size="small"
                    sx={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        fontWeight: 500,
                        borderRadius: '40px',
                        border: '1px solid',
                        borderColor: 'error.main',
                        height: '32px',
                        minWidth: '110px',
                        color: 'white',
                        px: 1,
                        '& .MuiChip-icon': {
                            marginLeft: '8px',
                            color: 'white'
                        },
                        '& .MuiChip-label': {
                            paddingLeft: '8px',
                            paddingRight: '8px'
                        }
                    }}
                />
            );
        }
        return null;
    }

    if (approved === true) {
        return (
            <Chip
                icon={<ThumbUpIcon />}
                label="Approved"
                color="success"
                size="small"
                onClick={() => onApprovalChange(null)}
                sx={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 500,
                    borderRadius: '40px',
                    border: '1px solid',
                    color: 'white',
                    borderColor: 'success.main',
                    height: '32px',
                    minWidth: '90px',
                    px: 1,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'scale(0.95)',
                        opacity: 0.8
                    },
                    '& .MuiChip-icon': {
                        marginLeft: '8px',
                        color: 'white'
                    },
                    '& .MuiChip-label': {
                        paddingLeft: '8px',
                        paddingRight: '8px'
                    }
                }}
            />
        );
    } else if (approved === false) {
        return (
            <Chip
                icon={<ThumbDownIcon />}
                label="Rejected"
                color="error"
                size="small"
                onClick={() => onApprovalChange(null)}
                sx={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 500,
                    borderRadius: '40px',
                    border: '1px solid',
                    borderColor: 'error.main',
                    height: '32px',
                    minWidth: '90px',
                    color: 'white',
                    px: 1,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'scale(0.95)',
                        opacity: 0.8
                    },
                    '& .MuiChip-icon': {
                        marginLeft: '8px',
                        color: 'white'
                    },
                    '& .MuiChip-label': {
                        paddingLeft: '8px',
                        paddingRight: '8px'
                    }
                }}
            />
        );
    } else {
        return (
            <Stack direction="row" spacing={1}>
                <IconButton
                    size="small"
                    color="success"
                    onClick={() => onApprovalChange(true)}
                    sx={{
                        border: '2px solid #4caf50',
                        color: '#4caf50',
                        bgcolor: 'transparent',
                        borderRadius: '40px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            bgcolor: 'rgba(76, 175, 80, 0.1)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 8px rgba(76, 175, 80, 0.3)'
                        }
                    }}
                >
                    <ThumbUpIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    color="error"
                    onClick={() => onApprovalChange(false)}
                    disabled={isWaitlisted}
                    sx={{
                        border: '2px solid #f44336',
                        color: '#f44336',
                        bgcolor: 'transparent',
                        borderRadius: '40px',
                        opacity: isWaitlisted ? 0.5 : 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            bgcolor: isWaitlisted ? 'transparent' : 'rgba(244, 67, 54, 0.1)',
                            transform: isWaitlisted ? 'none' : 'translateY(-1px)',
                            boxShadow: isWaitlisted ? 'none' : '0 4px 8px rgba(244, 67, 54, 0.3)'
                        },
                        '&:disabled': {
                            borderColor: '#f44336',
                            color: '#f44336'
                        }
                    }}
                >
                    <ThumbDownIcon fontSize="small" />
                </IconButton>
            </Stack>
        );
    }
};

const getRoundDisplayName = (status) => {
    const statusMap = {
        'SUBMITTED': 'Submitted',
        'UNDER_REVIEW': 'Under Review',
        'ACCEPTED': 'Accepted',
        'REJECTED': 'Rejected',
        'WAITLISTED': 'Waitlisted'
    };
    return statusMap[status] || status || 'Submitted';
};

const calculateGPA = (application) => {
    if (application.cumulativeGpa) {
        return parseFloat(application.cumulativeGpa).toFixed(2);
    }
    return application.cumulativeGpa || '0.00';
};

export default function CandidateManagement() {
    const [stats, setStats] = useState(mockStats);
    const [candidates, setCandidates] = useState(mockCandidates);
    const [loading, setLoading] = useState(false);

    const [statusFilter, setStatusFilter] = useState('all');
    const [approvalFilter, setApprovalFilter] = useState('all');

    const [bulkAdvanceDialogOpen, setBulkAdvanceDialogOpen] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const [resetDialogOpen, setResetDialogOpen] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const [statsData, candidatesData] = await Promise.all([
                adminAPI.fetchStats(),
                adminAPI.fetchCandidates()
            ]);

            const transformedCandidates = candidatesData.map(app => ({
                id: app.id,
                name: `${app.firstName || ''} ${app.lastName || ''}`.trim() || app.name || 'Unknown',
                email: app.email || 'No email',
                status: getRoundDisplayName(app.status),
                gpa: calculateGPA(app),
                cumulativeGpa: app.cumulativeGpa,
                majorGpa: app.majorGpa,
                currentRound: app.status || 'SUBMITTED',
                approved: app.approved,
                submittedAt: app.submittedAt,
                applicationStatus: app.status,
                application: app
            }));

            setCandidates(transformedCandidates);
            setStats({
                totalApplicants: statsData.totalApplicants || 0,
                tasks: statsData.tasks || 0,
                candidates: statsData.candidates || transformedCandidates.length,
                currentRound: statsData.currentRound || 'resume'
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setSnackbarMessage('Error loading data. Please check your connection.');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleApprovalChange = async (candidateId, approved) => {
        try {
            await adminAPI.updateApproval(candidateId, approved);
            await fetchDashboardData();

            setSnackbarMessage(`Candidate ${approved === null ? 'approval reset' : approved ? 'approved' : 'rejected'} successfully`);
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error updating candidate approval: ', error);
            setSnackbarMessage('Error updating approval. Please try again.');
            setSnackbarOpen(true);
        }
    };

    const handleEditCandidate = (candidate) => {
        setSelectedCandidate({
            ...candidate,
            editCumulativeGpa: candidate.cumulativeGpa || 0,
            editMajorGpa: candidate.majorGpa || 0,
            editCurrentRound: candidate.currentRound
        });
        setEditDialogOpen(true);
    };

    const handleSaveEdit = async () => {
        try {
            const updateData = {
                cumulativeGpa: selectedCandidate.editCumulativeGpa,
                majorGpa: selectedCandidate.editMajorGpa,
                currentRound: selectedCandidate.editCurrentRound,
            };

            await adminAPI.updateCandidate(selectedCandidate.id, updateData);
            await fetchDashboardData();

            setEditDialogOpen(false);
            setSelectedCandidate(null);
            setSnackbarMessage('Candidate updated successfully');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error updating candidate:', error);
            setSnackbarMessage('Error updating candidate. Please try again.');
            setSnackbarOpen(true);
        }
    };

    const handleBulkAdvanceRound = async () => {
        try {
            const approvedCandidates = candidates.filter(c =>
                c.approved === true &&
                c.currentRound !== 'REJECTED' &&
                c.currentRound !== 'ACCEPTED' &&
                c.currentRound !== 'WAITLISTED'
            );

            const rejectedCandidates = candidates.filter(c =>
                c.approved === false &&
                c.currentRound !== 'REJECTED' &&
                c.currentRound !== 'ACCEPTED' &&
                c.currentRound !== 'WAITLISTED'
            );

            const totalCandidates = approvedCandidates.length + rejectedCandidates.length;

            if (totalCandidates === 0) {
                setSnackbarMessage('No candidates with decisions found. Please approve or reject candidates first using the thumbs up/down buttons. Note: Waitlisted candidates must be processed individually.');
                setSnackbarOpen(true);
                return;
            }

            const updatePromises = [
                ...approvedCandidates.map(async (candidate) => {
                    let nextStatus;

                    if (candidate.currentRound === 'SUBMITTED') {
                        nextStatus = 'UNDER_REVIEW';
                    } else if (candidate.currentRound === 'UNDER_REVIEW') {
                        nextStatus = 'ACCEPTED';
                    } else {
                        return null;
                    }

                    return adminAPI.updateCandidate(candidate.id, {
                        status: nextStatus,
                        approved: null
                    });
                }),
                ...rejectedCandidates.map(async (candidate) => {
                    return adminAPI.updateCandidate(candidate.id, {
                        status: 'REJECTED',
                        approved: false
                    });
                })
            ];

            await Promise.all(updatePromises.filter(Boolean));
            await fetchDashboardData();

            setBulkAdvanceDialogOpen(false);
            setSnackbarMessage(
                `Successfully processed ${totalCandidates} candidates: ${approvedCandidates.length} advanced, ${rejectedCandidates.length} rejected`
            );
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error processing bulk advance: ', error);
            setSnackbarMessage('Error processing candidates. Please try again.');
            setSnackbarOpen(true);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchDashboardData();
        setRefreshing(false);
        setSnackbarMessage('Data refreshed successfully');
        setSnackbarOpen(true);
    };

    const handleAdvanceCandidate = async (candidateId) => {
        try {
            const candidate = candidates.find(c => c.id === candidateId);
            let nextStatus;

            if (candidate.currentRound === 'SUBMITTED') {
                nextStatus = 'UNDER_REVIEW';
            } else if (candidate.currentRound === 'UNDER_REVIEW') {
                nextStatus = 'ACCEPTED';
            } else if (candidate.currentRound === 'WAITLISTED') {
                nextStatus = 'ACCEPTED';
            } else {
                setSnackbarMessage('Candidate cannot be advanced further');
                setSnackbarOpen(true);
                return;
            }

            await adminAPI.updateCandidate(candidateId, {
                status: nextStatus,
                approved: null
            });

            await fetchDashboardData();
            setSnackbarMessage(`Candidate ${nextStatus === 'ACCEPTED' ? 'accepted and hired' : 'advanced to ' + getRoundDisplayName(nextStatus)}`);
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error advancing candidate:', error);
            setSnackbarMessage('Error advancing candidate. Please try again.');
            setSnackbarOpen(true);
        }
    };

    const handleRejectCandidate = async (candidateId) => {
        try {
            await adminAPI.updateCandidate(candidateId, {
                status: 'REJECTED',
                approved: false
            });

            await fetchDashboardData();
            setSnackbarMessage('Candidate rejected successfully');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error rejecting candidate:', error);
            setSnackbarMessage('Error rejecting candidate. Please try again.');
            setSnackbarOpen(true);
        }
    };

    const handleResetAll = async () => {
        try {
            await adminAPI.resetAll();
            await fetchDashboardData();
            setResetDialogOpen(false);
            setSnackbarMessage('All candidates reset to submitted status');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error resetting candidates:', error);
            setSnackbarMessage('Error resetting candidates. Please try again.');
            setSnackbarOpen(true);
        }
    };

    const filteredCandidates = candidates
        .filter(candidate => {
            const statusMatch = statusFilter === 'all' || candidate.currentRound === statusFilter;
            const approvalMatch = approvalFilter === 'all' ||
                (approvalFilter === 'approved' && candidate.approved == true) ||
                (approvalFilter === 'rejected' && candidate.approved === false) ||
                (approvalFilter === 'pending' && candidate.approved === null);

            return statusMatch && approvalMatch;
        })
        .sort((a, b) => {
            if (a.currentRound === 'REJECTED' && b.currentRound !== 'REJECTED') return 1;
            if (b.currentRound === 'REJECTED' && a.currentRound !== 'REJECTED') return -1;
            return 0;
        });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" gutterBottom sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', fontWeight: 700 }}>Candidate Management</Typography>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
                        onClick={handleRefresh}
                        disabled={refreshing}
                        sx={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            borderRadius: '40px',
                            textTransform: 'none',
                            fontWeight: 600,
                            transition: 'all 0.3s ease-in-out',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            borderWidth: '2px',
                            px: 3,
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                borderWidth: '2px',
                            },
                        }}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<Refresh />}
                        onClick={() => setResetDialogOpen(true)}
                        sx={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            borderRadius: '40px',
                            textTransform: 'none',
                            fontWeight: 600,
                            transition: 'all 0.3s ease-in-out',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            borderWidth: '2px',
                            px: 3,
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                borderWidth: '2px',
                            },
                        }}
                    >
                        Reset All
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SkipNextIcon />}
                        onClick={() => setBulkAdvanceDialogOpen(true)}
                        sx={{
                            bgcolor: 'success',
                            borderRadius: '40px',
                            textTransform: 'none',
                            fontWeight: 600,
                            transition: 'all 0.3s ease-in-out',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            borderWidth: '2px',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            px: 3,
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                borderWidth: '2px',
                            },
                        }}
                    >
                        Advance Round
                    </Button>
                </Stack>
            </Stack>

            <Stack direction="row" spacing={2} mb={3}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Round Filter</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Round Filter"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="all">All Rounds</MenuItem>
                        {rounds.map(round => (
                            <MenuItem key={round.key} value={round.key}>{round.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Approval Filter</InputLabel>
                    <Select
                        value={approvalFilter}
                        label="Approval Filter"
                        onChange={(e) => setApprovalFilter(e.target.value)}
                    >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                </FormControl>
            </Stack>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Current Round</TableCell>
                            <TableCell>Cumulative GPA</TableCell>
                            <TableCell>Approval Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCandidates.map((candidate) => {
                            const isFinalized = candidate.currentRound === 'ACCEPTED' || candidate.currentRound === 'REJECTED';
                            const isRejected = candidate.currentRound === 'REJECTED';

                            return (
                                <TableRow key={candidate.id}
                                    sx={{
                                        opacity: isRejected ? 0.6 : 1,
                                        backgroundColor: isFinalized ?
                                            (candidate.currentRound === 'ACCEPTED' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)')
                                            : 'transparent',
                                        '&:hover': {
                                            backgroundColor: isFinalized ?
                                                (candidate.currentRound === 'ACCEPTED' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)')
                                                : 'action.hover'
                                        }
                                    }}>
                                    <TableCell sx={{ opacity: isFinalized ? 0.8 : 1 }}>{candidate.name}</TableCell>
                                    <TableCell sx={{ opacity: isFinalized ? 0.8 : 1 }}>{candidate.email}</TableCell>
                                    <TableCell>
                                        <StatusIndicator status={candidate.status} />
                                    </TableCell>
                                    <TableCell sx={{ opacity: isFinalized ? 0.8 : 1 }}>{candidate.gpa}</TableCell>
                                    <TableCell>
                                        <ApprovalIndicator
                                            approved={candidate.approved}
                                            onApprovalChange={(approved) => handleApprovalChange(candidate.id, approved)}
                                            isDisabled={isFinalized}
                                            isWaitlisted={candidate.currentRound === 'WAITLISTED'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditCandidate(candidate)}
                                                disabled={isFinalized}
                                                sx={{ opacity: isFinalized ? 0.5 : 1 }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            {!isFinalized && candidate.currentRound !== 'WAITLISTED' && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => handleAdvanceCandidate(candidate.id)}
                                                    sx={{
                                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                                        borderRadius: '40px',
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        transition: 'all 0.3s ease-in-out',
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                        borderWidth: '2px',
                                                        px: 3,
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                                            borderWidth: '2px',
                                                        },
                                                    }}
                                                >
                                                    Advance
                                                </Button>
                                            )}
                                            {candidate.currentRound === 'WAITLISTED' && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="success"
                                                    onClick={() => handleAdvanceCandidate(candidate.id)}
                                                    sx={{
                                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                                        borderRadius: '40px',
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        transition: 'all 0.3s ease-in-out',
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                        borderWidth: '2px',
                                                        px: 3,
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                                            borderWidth: '2px',
                                                        },
                                                    }}
                                                >
                                                    Accept
                                                </Button>
                                            )}
                                            {!isFinalized && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleRejectCandidate(candidate.id)}
                                                    sx={{
                                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                                        borderRadius: '40px',
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        transition: 'all 0.3s ease-in-out',
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                        borderWidth: '2px',
                                                        px: 3,
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                                            borderWidth: '2px',
                                                        },
                                                    }}
                                                >
                                                    Reject
                                                </Button>
                                            )}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={bulkAdvanceDialogOpen} onClose={() => setBulkAdvanceDialogOpen(false)}>
                <DialogTitle sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', }}>Advance Round</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', }}>
                        This will advance all approved candidates to their next respective rounds and reset their approval status.
                    </Typography>
                    <Alert severity="info" sx={{ mt: 2 }}>
                        Each candidate will be advanced based on their current round:
                    </Alert>

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', mb: 2, fontWeight: 600 }}>
                            Candidates to be processed:
                        </Typography>

                        {rounds.map(round => {
                            if (round.key === 'WAITLISTED') return null;

                            const candidatesInRound = candidates.filter(c =>
                                c.currentRound === round.key && c.approved === true
                            );

                            if (candidatesInRound.length > 0) {
                                let nextRoundName;
                                if (round.key === 'SUBMITTED') nextRoundName = 'Under Review';
                                else if (round.key === 'UNDER_REVIEW') nextRoundName = 'Accepted (Hired)';

                                return (
                                    <Typography key={round.key} variant="body2" sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', mb: 1, color: 'success.main' }}>
                                        • {round.name} → {nextRoundName}: {candidatesInRound.length} candidates
                                    </Typography>
                                );
                            }
                            return null;
                        })}

                        {candidates.filter(c =>
                            c.approved === false &&
                            c.currentRound !== 'REJECTED' &&
                            c.currentRound !== 'WAITLISTED'
                        ).length > 0 && (
                                <Typography variant="body2" sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', mb: 1, color: 'error.main' }}>
                                    • Rejected candidates: {candidates.filter(c =>
                                        c.approved === false &&
                                        c.currentRound !== 'REJECTED' &&
                                        c.currentRound !== 'WAITLISTED'
                                    ).length} (will be moved to rejected status)
                                </Typography>
                            )}

                        {candidates.filter(c => c.currentRound === 'WAITLISTED').length > 0 && (
                            <Typography variant="body2" sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', mb: 1, color: 'warning.main' }}>
                                • Waitlisted candidates: {candidates.filter(c => c.currentRound === 'WAITLISTED').length} (must be processed individually using Accept/Reject buttons)
                            </Typography>
                        )}

                        {candidates.filter(c =>
                            c.approved !== null &&
                            c.currentRound !== 'REJECTED' &&
                            c.currentRound !== 'ACCEPTED' &&
                            c.currentRound !== 'WAITLISTED'
                        ).length === 0 && (
                                <Alert severity="warning" sx={{ mt: 1 }}>
                                    No candidates have been approved or rejected yet. Use the thumbs up/down buttons to make decisions first. Waitlisted candidates must be processed individually.
                                </Alert>
                            )}

                        {candidates.filter(c =>
                            c.approved === null &&
                            c.currentRound !== 'REJECTED' &&
                            c.currentRound !== 'ACCEPTED' &&
                            c.currentRound !== 'WAITLISTED'
                        ).length > 0 && (
                                <Typography variant="body2" sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', mt: 2, color: 'text.secondary' }}>
                                    Pending decisions: {candidates.filter(c =>
                                        c.approved === null &&
                                        c.currentRound !== 'REJECTED' &&
                                        c.currentRound !== 'ACCEPTED' &&
                                        c.currentRound !== 'WAITLISTED'
                                    ).length} candidates (will remain unchanged)
                                </Typography>
                            )}
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', }}>
                            Pending approvals: {candidates.filter(c => c.approved === null && c.currentRound !== 'rejected').length} candidates
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        sx={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            borderRadius: '40px',
                            textTransform: 'none',
                            fontWeight: 600,
                            transition: 'all 0.3s ease-in-out',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            borderWidth: '2px',
                            px: 3,
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                borderWidth: '2px',
                            },
                        }}
                        onClick={() => setBulkAdvanceDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleBulkAdvanceRound}
                        variant="contained"
                        color="success"
                        sx={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            borderRadius: '40px',
                            textTransform: 'none',
                            fontWeight: 600,
                            transition: 'all 0.3s ease-in-out',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            borderWidth: '2px',
                            px: 3,
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                borderWidth: '2px',
                            },
                        }}
                    >
                        Advance Round
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 600,
                    fontSize: '1.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    py: 3,
                    px: 3,
                    mb: 3
                }}>
                    Edit Candidate
                </DialogTitle>

                <DialogContent sx={{ px: 3, py: 4 }}>
                    {selectedCandidate && (
                        <Stack spacing={4}>
                            <Box sx={{
                                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                borderRadius: '16px',
                                p: 3,
                                mt: 4,
                                border: '1px solid #e0e7ff'
                            }}>
                                <Typography variant="h6" sx={{
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                    mb: 2,
                                    fontWeight: 600,
                                    color: '#374151',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    Candidate Information
                                </Typography>
                                <Stack spacing={1.5}>
                                    <Typography variant="body1" sx={{
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                        color: '#6b7280',
                                        fontSize: '0.95rem'
                                    }}>
                                        <Box component="span" sx={{ fontWeight: 600, color: '#374151' }}>Name:</Box> {selectedCandidate.name}
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                        color: '#6b7280',
                                        fontSize: '0.95rem'
                                    }}>
                                        <Box component="span" sx={{ fontWeight: 600, color: '#374151' }}>Email:</Box> {selectedCandidate.email}
                                    </Typography>
                                </Stack>
                            </Box>

                            <Box>
                                <Typography variant="subtitle1" sx={{
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                    mb: 2,
                                    fontWeight: 600,
                                    color: '#374151',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    Update Status
                                </Typography>

                                <FormControl fullWidth>
                                    <InputLabel sx={{
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                        fontWeight: 500,
                                        color: '#6b7280'
                                    }}>
                                        Candidate Status
                                    </InputLabel>
                                    <Select
                                        value={selectedCandidate.editCurrentRound || ''}
                                        label="Candidate Status"
                                        onChange={(e) => setSelectedCandidate(prev => ({
                                            ...prev,
                                            editCurrentRound: e.target.value
                                        }))}
                                        sx={{
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                            borderRadius: '16px',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderWidth: '2px',
                                                borderColor: '#d1d5db'
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderWidth: '2px',
                                                borderColor: '#9ca3af'
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderWidth: '2px',
                                                borderColor: '#667eea'
                                            },
                                            '& .MuiSelect-select': {
                                                py: 1.5,
                                                fontWeight: 500
                                            }
                                        }}
                                    >
                                        <MenuItem
                                            value="SUBMITTED"
                                            sx={{
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                                borderRadius: '12px',
                                                m: 0.5,
                                                py: 1.5,
                                                fontWeight: 500,
                                                '&:hover': {
                                                    background: 'rgba(99, 102, 241, 0.1)'
                                                }
                                            }}
                                        >
                                            Submitted
                                        </MenuItem>
                                        <MenuItem
                                            value="UNDER_REVIEW"
                                            sx={{
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                                borderRadius: '12px',
                                                m: 0.5,
                                                py: 1.5,
                                                fontWeight: 500,
                                                '&:hover': {
                                                    background: 'rgba(59, 130, 246, 0.1)'
                                                }
                                            }}
                                        >
                                            Under Review
                                        </MenuItem>
                                        <MenuItem
                                            value="ACCEPTED"
                                            sx={{
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                                borderRadius: '12px',
                                                m: 0.5,
                                                py: 1.5,
                                                fontWeight: 500,
                                                '&:hover': {
                                                    background: 'rgba(34, 197, 94, 0.1)'
                                                }
                                            }}
                                        >
                                            Accepted
                                        </MenuItem>
                                        <MenuItem
                                            value="REJECTED"
                                            sx={{
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                                borderRadius: '12px',
                                                m: 0.5,
                                                py: 1.5,
                                                fontWeight: 500,
                                                '&:hover': {
                                                    background: 'rgba(239, 68, 68, 0.1)'
                                                }
                                            }}
                                        >
                                            Rejected
                                        </MenuItem>
                                        <MenuItem
                                            value="WAITLISTED"
                                            sx={{
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                                borderRadius: '12px',
                                                m: 0.5,
                                                py: 1.5,
                                                fontWeight: 500,
                                                '&:hover': {
                                                    background: 'rgba(245, 158, 11, 0.1)'
                                                }
                                            }}
                                        >
                                            Waitlisted
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Stack>
                    )}
                </DialogContent>

                <DialogActions sx={{
                    px: 3,
                    py: 3,
                    gap: 1.5,
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    borderTop: '1px solid #e2e8f0'
                }}>
                    <Button
                        onClick={() => setEditDialogOpen(false)}
                        sx={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            borderRadius: '40px',
                            px: 4,
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            color: '#6b7280',
                            border: '2px solid #d1d5db',
                            background: 'white',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                borderColor: '#9ca3af',
                                background: '#f9fafb',
                                transform: 'translateY(-1px)'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveEdit}
                        variant="contained"
                        sx={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            borderRadius: '40px',
                            px: 4,
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                            border: 'none',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.5)',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
                <DialogTitle>Reset All Candidates</DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', }}>
                        This will reset ALL candidates back to "Submitted" status and clear their approval status.
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        sx={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            borderRadius: '40px',
                            textTransform: 'none',
                            fontWeight: 600,
                            transition: 'all 0.3s ease-in-out',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            borderWidth: '2px',
                            px: 3,
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                borderWidth: '2px',
                            },
                        }}
                        onClick={() => setResetDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleResetAll}
                        color="warning"
                        variant="contained"
                        sx={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            borderRadius: '40px',
                            textTransform: 'none',
                            fontWeight: 600,
                            transition: 'all 0.3s ease-in-out',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            borderWidth: '2px',
                            px: 3,
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                borderWidth: '2px',
                            },
                        }}
                    >
                        Reset All
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />
        </Box>
    );
}