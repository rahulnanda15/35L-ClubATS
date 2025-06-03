import React from 'react';
import {
  Box,
  Button,
  CssBaseline,
  Paper,
  ThemeProvider,
  Typography,
  createTheme
} from '@mui/material';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0'
    },
    background: {
      default: '#fafafa'
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h4: { fontWeight: 600 },
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
        },
      },
    },
  }
});

const LeftSection = styled(Box)(() => ({
  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '2rem'
}));

const RightSection = styled(Box)(() => ({
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '2rem'
}));

export default function LinkExpired() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Box sx={{ width: '50%' }}>
          <LeftSection>
            <Typography variant="h2" sx={{ textAlign: 'center' }}>
              Link Expired
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, textAlign: 'center', maxWidth: 400 }}>
              The reset password link has expired or has already been used.
            </Typography>
          </LeftSection>
        </Box>

        <Box sx={{ width: '50%' }}>
          <RightSection>
            <Paper elevation={0} sx={{ p: 6, maxWidth: '400px', textAlign: 'center', backgroundColor: 'transparent' }}>
              <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
                Request a new link
              </Typography>
              <Typography sx={{ mb: 4 }}>
                Go back to the login page and click “Forgot password” to request a new reset link.
              </Typography>
              <Button variant="contained" size="large" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </Paper>
          </RightSection>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
