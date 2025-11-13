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
import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import PersonIcon from '@mui/icons-material/Person';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import titleImg from '../assets/nature-run.jpg';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [avatarKey, setAvatarKey] = useState(Date.now());

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userLoggedIn'));
    navigate('/login');
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 256 * 1024) {
      alert('Avatar image must be less than 256KB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await fetch(`http://localhost:8080/api/profile-picture/${user.user_id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      // Update user in localStorage with new avatar URL
      const avatarUrl = `http://localhost:8080/api/profile-picture/${user.user_id}`;
      const updatedUser = {
        ...user,
        avatar_url: avatarUrl,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Force avatar image reload
      setAvatarKey(Date.now());
      
      // Update navigation avatar
      window.dispatchEvent(new Event('userLoggedIn'));
      
      alert('Avatar updated successfully!');
    } catch (error) {
      alert('Failed to upload avatar: ' + error.message);
    } finally {
      setUploading(false);
    }
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
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={user.avatar_url ? `${user.avatar_url}?t=${avatarKey}` : undefined}
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: user.avatar_url ? 'transparent' : 'primary.main',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  {!user.avatar_url && user.username?.[0]?.toLowerCase()}
                </Avatar>
                
                <Button
                  component="label"
                  variant="contained"
                  size="small"
                  disabled={uploading}
                  sx={{
                    position: 'absolute',
                    bottom: -10,
                    right: -10,
                    minWidth: 40,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    p: 0,
                  }}
                >
                  {uploading ? (
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                  ) : (
                    <CloudUploadIcon fontSize="small" />
                  )}
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                </Button>
              </Box>

              <Box>
                <Typography variant="h4" fontWeight={600}>
                  {user.username}
                </Typography>
                <Chip label="Runner" color="primary" sx={{ mt: 1 }} />
              </Box>
            </Box>

            <Box>
              <Typography variant="h5" gutterBottom>
                Profile Info
              </Typography>
              
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PersonIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Username
                    </Typography>
                    <Typography variant="body1">{user.username}</Typography>
                  </Box>
                </Box>

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
