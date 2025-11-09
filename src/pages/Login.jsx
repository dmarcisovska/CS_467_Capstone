import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Stack,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import Alert from '@mui/material/Alert';
import heroImage from '../assets/nature-run.jpg'; // ⬅️ update this path to your local image

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      console.log('Login successful:', response);

      // Store user data in localStorage for profile page
      localStorage.setItem('user', JSON.stringify(response.user));

      // Redirect to events page
      navigate('/events');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Dark overlay for readability */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />

      {/* Login form */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0)',
          borderRadius: 2,
          p: 4,
          width: '90%',
          maxWidth: 400,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h2"
          sx={{ mb: 3, fontWeight: 'bold', color: 'white' }}
        >
          Log in
        </Typography>

        <Container sx={{}}>
          <Stack spacing={2}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Divider />
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Username"
                variant="filled"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                sx={{
                  mb: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  borderRadius: 1,
                }}
              />
              <TextField
                label="Password"
                type="password"
                variant="filled"
                fullWidth
                name="password"
                value={formData.password}
                onChange={handleChange}
                sx={{
                  mb: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  borderRadius: 1,
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 4, mb: 2 }}
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} /> : 'Login'}
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
