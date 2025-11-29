import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import titleImg from '../assets/nature-run.jpg';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import CircularProgress from '@mui/material/CircularProgress';
import { API_BASE_URL } from '../services/api';

const Register = () => {
  const navigate = useNavigate();

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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    birthday: null,
    avatarUrl: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // const [uploading, setUploading] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBirthdayChange = (newValue) => {
    setFormData({
      ...formData,
      birthday: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (
      !formData.name ||
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.birthday
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    const today = dayjs();
    const birthDate = dayjs(formData.birthday);
    const age = today.diff(birthDate, 'year');

    if (age < 16) {
      setError('You must be at least 16 years old to register.');
      return;
    }

    setSubmitting(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        birthday: formData.birthday ? formData.birthday.format('YYYY-MM-DD') : null,
        avatar_url: formData.avatarUrl || null,
      };

      const response = await registerUser(userData);

      // upload avatar after user is created
      if (selectedAvatarFile && response.user && response.user.user_id) {
        try {
          await handleAvatarUpload(selectedAvatarFile, response.user.user_id);
        } catch (avatarError) {
          console.error('Avatar upload failed, but registration succeeded:', avatarError);
        }
      } else {
        console.log('Skipping avatar upload - no file selected');
      }

      setSuccess('Registration successful! Redirecting to login...');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error message:', err.message); // More detailed error
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarUpload = async (file, user_id) => {
      if (!file) return;
  
      if (file.size > 256 * 1024) {
        alert('Avatar image must be less than 256KB');
        return;
      }
  
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
  
      // setUploading(true);
  
      try {
        const formData = new FormData();
        formData.append('profilePicture', file);
  
        const uploadUrl = `${API_BASE_URL}/api/profile-picture/${user_id}`;
        const response = await fetch(uploadUrl, {
          method: 'PATCH',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Failed to upload avatar');
        }
  
        // const updatedUser = { ...user };
  
        // localStorage.setItem('user', JSON.stringify(updatedUser));
        // setUser(updatedUser);
        // setAvatarKey(Date.now()); // cache-bust on this page only
        // window.dispatchEvent(new Event('userLoggedIn'));
  
        // alert('Avatar updated successfully!');
      } catch (error) {
        alert('Failed to upload avatar: ' + error.message);
      }
    };

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
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1,
          }}
        />

        <Typography
          variant="h2"
          component="h1"
          sx={{
            position: 'relative',
            zIndex: 2,
          }}
        >
          Create Account
        </Typography>
      </Box>

      <Container sx={{ py: 4, maxWidth: '600px !important' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              backgroundColor: 'background.paper',
              p: 4,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Stack spacing={3}>
              <Typography variant="h5" fontWeight={300}>
                Create account
              </Typography>

              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              <TextField
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="filled"
              />

              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="filled"
              />

              <TextField
                required
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                variant="filled"
              />

              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                variant="filled"
                helperText="Must be at least 8 characters"
              />

              <TextField
                required
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                variant="filled"
              />

              <DatePicker
                label="Birthdate"
                value={formData.birthday}
                onChange={handleBirthdayChange}
                maxDate={dayjs().subtract(16, 'year')}
                slotProps={{
                  textField: {
                    variant: 'filled',
                    fullWidth: true,
                    helperText: 'You must be at least 16 years old',
                    required: true,
                  },
                }}
              />

              <Button
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload avatar
                <VisuallyHiddenInput
                  type="file"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setSelectedAvatarFile(file);
                  }}
                  accept='image/*'
                  multiple
                />
              </Button>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                endIcon={submitting ? null : <PersonAddIcon />}
                sx={{ mt: 2 }}
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} /> : 'Create Account'}
              </Button>

              <Typography
                variant="body2"
                textAlign="center"
                color="text.secondary"
              >
                Already have an account?{' '}
                <Button
                  component={Link}
                  to="/login"
                  sx={{ textTransform: 'none' }}
                >
                  Log in here
                </Button>
              </Typography>
            </Stack>
          </Box>
        </LocalizationProvider>
      </Container>
    </>
  );
};

export default Register;
