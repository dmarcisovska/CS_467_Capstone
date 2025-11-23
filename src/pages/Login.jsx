import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import heroImage from '../assets/nature-run.jpg';
import { loginUser } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setSubmitting(true);

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", response.token);
      console.log('Found user with matching password:', response);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Dispatch custom event to notify Nav component
      window.dispatchEvent(new Event('userLoggedIn'));
      
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
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />

      <Box
        component="form"
        onSubmit={handleSubmit}
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          name="email"
          label="Email"
          type="email"
          variant="filled"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          required
          sx={{
            mb: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.85)', 
            borderRadius: 1,
          }}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          variant="filled"
          fullWidth
          value={formData.password}
          onChange={handleChange}
          required
          sx={{
            mb: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.85)', 
            borderRadius: 1,
          }}
        />

        <Button 
          type="submit"
          variant="contained" 
          color="primary" 
          fullWidth 
          size="large"
          disabled={submitting}
        >
          {submitting ? <CircularProgress size={24} /> : 'Log in'}
        </Button>

        <Typography
          variant="body2"
          sx={{ mt: 2, color: 'white' }}
        >
          Don't have an account?{' '}
          <Button 
            component={Link}
            to="/register" 
            sx={{ 
              textTransform: 'none', 
              color: 'white',
              textDecoration: 'underline',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            Register here
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
