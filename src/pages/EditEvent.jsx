import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import titleImg from '../assets/trail3.jpg';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import SaveIcon from '@mui/icons-material/Save';
import Autocomplete from 'react-google-autocomplete';
import dayjs from 'dayjs';
import { fetchEventById, updateEvent } from '../services/api';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    date: null,
    startTime: null,
    description: '',
    address: '',
    latitude: null,
    longitude: null,
    distance: '',
    elevation: '',
    difficulty: '',
    sponsors: '',
    prizes: '',
  });

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    loadEvent();
  }, [id, navigate]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const data = await fetchEventById(id);
      
      const user = JSON.parse(localStorage.getItem('user'));
      if (data.creator_user_id !== user.user_id) {
        setError('You do not have permission to edit this event');
        setTimeout(() => navigate(`/events/${id}`), 2000);
        return;
      }

      const eventDate = dayjs(data.event_datetime);
      
      setFormData({
        name: data.name || '',
        date: eventDate,
        startTime: eventDate,
        description: data.description || '',
        address: '',
        latitude: data.latitude,
        longitude: data.longitude,
        distance: data.distance || '',
        elevation: data.elevation || '',
        difficulty: data.difficulty || '',
        sponsors: data.sponsors?.[0]?.sponsor || '',
        prizes: data.sponsors?.[0]?.prize || '',
      });
    } catch (err) {
      setError('Failed to load event');
      console.error('Error loading event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (newValue) => {
    setFormData({ ...formData, date: newValue });
  };

  const handleTimeChange = (newValue) => {
    setFormData({ ...formData, startTime: newValue });
  };

  const handlePlaceSelected = (place) => {
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      
      setFormData({
        ...formData,
        address: place.formatted_address,
        latitude: lat,
        longitude: lng,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.date || !formData.startTime) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const eventDateTime = formData.date
        .hour(formData.startTime.hour())
        .minute(formData.startTime.minute())
        .second(0)
        .format('YYYY-MM-DD HH:mm:ss');

      const eventData = {
        name: formData.name,
        event_datetime: eventDateTime,
        latitude: formData.latitude,
        longitude: formData.longitude,
        description: formData.description || null,
        distance: parseFloat(formData.distance) || null,
        elevation: parseFloat(formData.elevation) || null,
        difficulty: formData.difficulty || null,
        sponsors: formData.sponsors || null,
        prizes: formData.prizes || null,
      };

      await updateEvent(id, eventData);
      setSuccess('Event updated successfully! Redirecting...');
      
      setTimeout(() => {
        navigate(`/events/${id}`);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
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
          sx={{ position: 'relative', zIndex: 2 }}
        >
          Edit Event
        </Typography>
      </Box>

      <Box>
        <Container
          sx={{
            pt: 4,
            zIndex: 1,
            position: 'relative',
            maxWidth: { xs: '100%', sm: '600px', md: '700px' },
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
              Event Details
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Divider />
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Event Name"
                    value={formData.name}
                    onChange={handleChange}
                    variant="filled"
                    required
                    sx={{ mb: 2 }}
                  />
                  
                  <DatePicker
                    label="Event Date"
                    value={formData.date}
                    onChange={handleDateChange}
                    slotProps={{
                      textField: {
                        variant: 'filled',
                        fullWidth: true,
                        required: true,
                        sx: { mb: 2 },
                      },
                    }}
                  />
                  
                  <TimePicker
                    label="Start Time"
                    value={formData.startTime}
                    onChange={handleTimeChange}
                    slotProps={{
                      textField: {
                        variant: 'filled',
                        fullWidth: true,
                        required: true,
                        sx: { mb: 2 },
                      },
                    }}
                  />

                  <TextField
                    name="description"
                    label="Event Description"
                    value={formData.description}
                    onChange={handleChange}
                    variant="filled"
                    fullWidth
                    multiline
                    rows={4}
                  />

                  <Typography variant="h6" sx={{ mt: 3, mb: 1, width: '100%' }}>
                    Event Location
                  </Typography>

                  <Autocomplete
                    apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                    onPlaceSelected={handlePlaceSelected}
                    options={{
                      types: ['address'],
                      componentRestrictions: { country: 'us' },
                    }}
                    style={{
                      width: '100%',
                      padding: '16.5px 14px',
                      fontSize: '16px',
                      border: 'none',
                      borderBottom: '1px solid rgba(0,0,0,0.42)',
                      backgroundColor: 'rgba(0,0,0,0.06)',
                      borderRadius: '4px 4px 0 0',
                      marginBottom: '16px',
                      fontFamily: 'Roboto, sans-serif',
                    }}
                    placeholder="Update address..."
                  />

                  <TextField
                    fullWidth
                    name="distance"
                    label="Distance (miles)"
                    type="number"
                    value={formData.distance}
                    onChange={handleChange}
                    variant="filled"
                  />
                  
                  <TextField
                    fullWidth
                    name="elevation"
                    label="Elevation Gain (ft)"
                    value={formData.elevation}
                    onChange={handleChange}
                    variant="filled"
                    type="number"
                  />
                  
                  <TextField
                    select
                    fullWidth
                    name="difficulty"
                    label="Difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    variant="filled"
                  >
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Moderate">Moderate</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                  </TextField>

                  <Typography variant="h6" sx={{ mt: 3, mb: 1, width: '100%' }}>
                    Sponsors & Prizes
                  </Typography>

                  <TextField
                    fullWidth
                    name="sponsors"
                    label="Sponsors"
                    value={formData.sponsors}
                    onChange={handleChange}
                    variant="filled"
                    multiline
                    rows={2}
                  />

                  <TextField
                    fullWidth
                    name="prizes"
                    label="Prizes"
                    value={formData.prizes}
                    onChange={handleChange}
                    variant="filled"
                    multiline
                    rows={2}
                  />
                </Grid>

                <Stack direction="row" spacing={2} sx={{ mt: 4, mb: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={submitting ? null : <SaveIcon />}
                    disabled={submitting}
                  >
                    {submitting ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate(`/events/${id}`)}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            </LocalizationProvider>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default EditEvent;
