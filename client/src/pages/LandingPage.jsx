import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Stack
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Analytics as AnalyticsIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0'
        },
        secondary: {
            main: '#fff',
        },
        background: {
            default: '#fafafa'
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '3.5rem',
            '@media (max-width:600px)': {
                fontSize: '2.5rem',
            },
        },
        h4: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '40px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    padding: '12px 32px',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '20px',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
                    }
                }
            }
        }
    }
});

const FeatureCard = ({ icon, title, description }) => (
    <Card sx={{ height: '100%', boxShadow: 3 }}>
        <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Box sx={{ color: 'primary.main', mb: 2 }}>
                {icon}
            </Box>
            <Typography variant="h6" component="h3" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {description}
            </Typography>
        </CardContent>
    </Card>
);

export default function LandingPage() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    // Redirect if user is already logged in
    useEffect(() => {
        if (!loading && user) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    // Don't render the landing page if user is already authenticated
    if (loading) {
        return <div>Loading...</div>;
    }

    if (user) {
        return null; // Component will redirect via useEffect
    }

    const features = [
        {
            icon: <DashboardIcon sx={{ fontSize: 40 }} />,
            title: "Smart Dashboard",
            description: "View progress and manage tasks like scoring resumes and responses all in one place"
        },
        {
            icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
            title: "Powerful Analytics",
            description: "View all applicants, their grades, profiles, and rank them with advanced filtering"
        },
        {
            icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
            title: "Interview Scheduling",
            description: "Easily schedule and manage interviews with candidates through integrated tools"
        }
    ];

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet"></link>
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    py: 4
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography
                            variant="h1"
                            component="h1"
                            sx={{
                                color: 'white',
                                mb: 2,
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            Club Application Tracker
                        </Typography>
                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                mb: 6,
                                fontWeight: 400,
                            }}
                        >
                            Streamline your club's application process
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 3,
                                mb: 6,
                                justifyContent: 'center',
                                flexWrap: { xs: 'wrap', md: 'nowrap' }
                            }}
                        >
                            {features.map((feature, index) => (
                                <Box key={index} sx={{ width: { xs: '100%', md: '280px' }, maxWidth: '280px' }}>
                                    <FeatureCard {...feature} />
                                </Box>
                            ))}
                        </Box>

                        <Stack
                            direction={{ xs: 'column', sm: 'row', }}
                            spacing={3}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/login')}
                                sx={{
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    minWidth: 160,
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.9)'
                                    },
                                }}
                            >
                                Log in
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/signup')}
                                sx={{
                                    borderColor: 'white',
                                    color: 'white',
                                    minWidth: 160,
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderColor: 'white',
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        borderWidth: 2
                                    }
                                }}
                            >
                                Sign Up
                            </Button>
                        </Stack>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
}