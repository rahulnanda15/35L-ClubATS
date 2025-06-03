import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CssBaseline,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import styled from '@emotion/styled';

const theme = createTheme({ /* your same theme config here */ });

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

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [isAllowed, setIsAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setChecking(false);       // ✅ ensure render resumes
      navigate('/link-expired'); // or '/404'
    }, 5000);
  
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        clearTimeout(timeoutId);
        setIsAllowed(true);
        setChecking(false);
      }
    });
  
    return () => {
      clearTimeout(timeoutId);
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      alert('Failed to update password: ' + error.message);
    } else {
      alert('Password updated successfully!');
      navigate('/login');
    }
  };

  if (checking || !isAllowed) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Box sx={{ width: '50%' }}>
          <LeftSection>
            <Typography variant="h1" sx={{ textAlign: 'center', fontSize: { xs: '2.5rem', md: '3rem' } }}>
              Reset Your Password
            </Typography>
            <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.9)', textAlign: 'center', maxWidth: '400px' }}>
              Enter a new password to complete the reset process.
            </Typography>
          </LeftSection>
        </Box>

        <Box sx={{ width: '50%' }}>
          <RightSection>
            <Paper elevation={0} sx={{ p: 6, maxWidth: '400px', backgroundColor: 'transparent' }}>
              <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: 'primary.main' }}>
                Set New Password
              </Typography>

              <Box component="form" onSubmit={handleResetPassword}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  variant="outlined"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  sx={{ mb: 4 }}
                  InputProps={{
                    sx: { backgroundColor: 'rgba(0, 0, 0, 0.02)' }
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    mb: 3,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                    },
                  }}
                >
                  Update Password
                </Button>
              </Box>
            </Paper>
          </RightSection>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
