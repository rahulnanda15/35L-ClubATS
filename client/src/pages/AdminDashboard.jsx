import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  Menu,
  Divider,
  Avatar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Add as AddIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Download as DownloadIcon,
  Launch as LaunchIcon,
  MoreVert as MoreVertIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0'
    },
    secondary: {
      main: '#fff'
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff'
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#2c3e50'
    },
    h6: {
      fontWeight: 600,
      color: '#2c3e50'
    },
    body2: {
      color: '#7f8c8d'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f0f0f0',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
          }
        }
      }
    }
  }
});

const DRAWER_WIDTH = 280;

const mockData = {
  totalApplicants: 187,
  applicationsReviewed: 82,
  upcomingInterviews: 24,
  finalSelections: 'Pending'
};

const mockTasks = [
  { id: 1, title: 'Grade 3 Cover Letters', dueDate: 'Today', priority: 'High', category: 'Grading' },
  { id: 2, title: 'Grade 4 Videos', dueDate: 'Tomorrow', priority: 'Medium', category: 'Grading' },
  { id: 3, title: 'Sign up for interviews', dueDate: 'Feb 18, 2025', priority: 'Low', category: 'Interviews' },
  { id: 4, title: 'Fill out referrals', dueDate: 'Feb 20, 2025', priority: 'Medium', category: 'Referrals' }
];

const mockCandidates = [
  { id: 1, name: 'Pranav Kunnath', email: 'pranav@email.com', status: 'Interview Round 1', score: 85 },
  { id: 2, name: 'Ronit Anilkumar', email: 'ronit@email.com', status: 'Resume Review', score: 92 },
  { id: 3, name: 'Jishan Kharbanda', email: 'jishan@email.com', status: 'Final Decision', score: 78 },
  { id: 4, name: 'Jackson Bae', email: 'jackson@email.com', status: 'Interview Round 2', score: 88 }
];

const StatusIndicator = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Resume Review': return 'info';
      case 'Interview Round 1': return 'warning';
      case 'Interview Round 2': return 'primary';
      case 'Final Decision': return 'success';
      default: return 'default';
    }
  };

  return <Chip label={status} color={getStatusColor(status)} size="small" />;
};

const PriorityIndicator = ({ priority }) => {
  const colors = {
    'High': 'error',
    'Medium': 'warning',
    'Low': 'success'
  };
  
  return <Chip label={priority} color={colors[priority]} size="small" variant="outlined" />;
};

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cycleDialogOpen, setCycleDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [stats, setStats] = useState(mockData);
  const [tasks, setTasks] = useState(mockTasks);
  const [candidates, setCandidates] = useState(mockCandidates);

  useEffect(() => {
    // Replace with actual logic for Supabase
    const fetchDashboardData = async () => {
      try {
        console.log('TODO: Fetch actual data from Supabase backend');
      } catch (error) {
        console.error('Error fetching data from Supabase backend: ', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCycleCreation = async (cycleData) => {
    // Replace with actual logic for Supabase
    try {
      console.log('TODO: Create logic for application cycle and submitting to Supabase backend');
    } catch (error) {
      console.error('Error creating cycle: ', error);
    }
  };

  const handleAssignTask = async (taskData) => {
    // Replace with actual logic for Supabase
    try {
      console.log('TODO: Assign task');
    } catch (error) {
      console.error('Error assigning task: ', error);
    }
  };

  const handleStatusUpdate = async (candidateId, newStatus) => {
    // Replace with actual logic for Supabase
    try {
      console.log('TODO: Update candidate status');

      // Local state update
      setCandidates(prev => prev.map(candidate =>
        candidate.id === candidateId
        ? { ...candidate, status: newStatus }
        : candidate
      ));
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  };

  return (
    <Typography>Admin Dashboard</Typography>
  )
}

/*import { useState } from "react";

export default function AdminDashboard() {
  const [currentCycle, setCurrentCycle] = useState("Fall 2025");
  const [round, setRound] = useState(1);
  const [assignedTasks, setAssignedTasks] = useState([]);

  const reviewers = ["Alice", "Bob", "Charlie"];
  const candidates = ["Jane Doe", "John Smith", "Emily Liu"];

  const handleAdvanceRound = () => {
    setRound((prev) => prev + 1);
  };

  const handleAssignTasks = () => {
    const tasks = candidates.map((candidate, i) => ({
      reviewer: reviewers[i % reviewers.length],
      candidate,
      task: "Review Resume",
    }));
    setAssignedTasks(tasks);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      <div className="space-y-2">
        <p><strong>Current Cycle:</strong> {currentCycle}</p>
        <p><strong>Current Round:</strong> Round {round}</p>

        <button
          onClick={handleAdvanceRound}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Advance to Next Round
        </button>
      </div>

      <hr />

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Assign Tasks</h3>
        <button
          onClick={handleAssignTasks}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Assign Resume Reviews
        </button>

        {assignedTasks.length > 0 && (
          <ul className="mt-4 list-disc list-inside space-y-1">
            {assignedTasks.map((task, idx) => (
              <li key={idx}>
                {task.reviewer} → {task.task} for {task.candidate}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
  */