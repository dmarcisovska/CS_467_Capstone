import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import titleImg from '../assets/trail3.jpg';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Not logged in, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          height: '400px',
          backgroundImage: `url(${titleImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}
        />
        <Typography
          variant="h2"
          component="h1"
          sx={{ position: 'relative', zIndex: 2, px: 2 }}
        >
          My Profile
        </Typography>
      </Box>

      <Container sx={{ py: 4 }}>
        <Paper sx={{ p: 4, position: 'relative' }}>
          <Stack spacing={4}>
            {/* Avatar and Username */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                src={user.avatar_url}
                sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}
              >
                {user.username?.[0]?.toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={600}>
                  {user.username}
                </Typography>
                <Chip label="Runner" color="primary" sx={{ mt: 1 }} />
              </Box>
            </Box>

            {/* Profile Information */}
            <Box>
              <Typography variant="h5" gutterBottom>
                Profile Information
              </Typography>
              
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{user.email}</Typography>
                  </Box>
                </Box>

                {user.birthday && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CakeIcon color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Birthday
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(user.birthday)}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {user.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocationOnIcon color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1">{user.location}</Typography>
                    </Box>
                  </Box>
                )}

                {user.bio && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Bio
                    </Typography>
                    <Typography variant="body1">{user.bio}</Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(user.created_at)}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Actions */}
            <Box sx={{ pt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </>
  );
};

export default Profile;
