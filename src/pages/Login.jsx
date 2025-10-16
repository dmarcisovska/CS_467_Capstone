import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import heroImage from '../assets/nature-run.jpg'; // ⬅️ update this path to your local image

const Login = () => {
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
          Login
        </Typography>

        <TextField
          label="Username"
          variant="filled"
          fullWidth
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
           sx={{
            mb: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.85)', 
            borderRadius: 1,
          }}
        />

        <Button variant="contained" color="primary" fullWidth size="large">
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
