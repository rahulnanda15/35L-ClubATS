import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import styled from '@emotion/styled';
import { supabase } from '../supabase'; // Make sure path is correct

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
    secondary: { main: '#fff' },
    background: { default: '#fafafa' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '3.5rem' },
    h4: { fontWeight: 600 },
    h6: { fontWeight: 600 },
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
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            transition: 'all 0.3s ease-in-out',
            '&:hover > fieldset': { borderColor: '#1976d2' },
            '&.Mui-focused > fieldset': { borderColor: '#1976d2', borderWidth: '2px' },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

const LeftSection = styled(Box)(() => ({
  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '2rem',
}));

const RightSection = styled(Box)(() => ({
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '2rem',
}));

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Please enter both email and password.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });

    if (error) {
      console.error('Login error:', error.message);
      alert('Login failed: ' + error.message);
      return;
    }

    alert(`Successfully logged in as ${username}`);
    navigate('/application-list'); // Or wherever you want to redirect
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Box sx={{ width: '50%' }}>
          <LeftSection>
            <Typography variant="h1" sx={{ mb: 2, textAlign: 'center' }}>
              Club Application Tracker
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
                fontWeight: 400,
                maxWidth: '400px',
              }}
            >
              Welcome back
            </Typography>
          </LeftSection>
        </Box>

        <Box sx={{ width: '50%' }}>
          <RightSection>
            <Paper elevation={0} sx={{ p: 6, width: '100%', maxWidth: '400px', backgroundColor: 'transparent' }}>
              <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: 'primary.main' }}>
                Sign in
              </Typography>

              <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{ mb: 4 }}
                />

                <Button type="submit" fullWidth variant="contained" size="large" sx={{ mb: 3 }}>
                  Sign In
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Don't have an account?{' '}
                    <Typography
                      component="span"
                      onClick={() => navigate('/signup')}
                      sx={{
                        color: 'primary.main',
                        cursor: 'pointer',
                        fontWeight: 600,
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Sign up here
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </RightSection>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
