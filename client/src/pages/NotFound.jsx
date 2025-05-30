import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import styled from '@emotion/styled';

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
    h1: { fontWeight: 700, fontSize: '3.5rem' },
    h5: { fontWeight: 400 },
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

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Box sx={{ width: '50%' }}>
          <LeftSection>
            <Typography variant="h1" sx={{ textAlign: 'center' }}>
              404
            </Typography>
            <Typography variant="h5" sx={{ textAlign: 'center', maxWidth: '400px', mt: 2 }}>
              Oops! The page you're looking for doesn't exist.
            </Typography>
          </LeftSection>
        </Box>

        <Box sx={{ width: '50%' }}>
          <RightSection>
            <Paper elevation={0} sx={{ p: 6, maxWidth: '400px', backgroundColor: 'transparent' }}>
              <Typography variant="h4" sx={{ mb: 3, color: 'primary.main', textAlign: 'center' }}>
                Lost?
              </Typography>

              <Typography sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
                Click below to return to the home page.
              </Typography>

              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/')}
                sx={{
                  py: 1.5,
                  borderRadius: '40px',
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                  },
                }}
              >
                Go Home
              </Button>
            </Paper>
          </RightSection>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default NotFound;
