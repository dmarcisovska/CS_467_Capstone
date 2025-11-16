import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import titleImg from '../assets/trail3.jpg';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RunCircleIcon from '@mui/icons-material/RunCircle';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Autocomplete from 'react-google-autocomplete';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../services/api';

const Create = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    date: null,
    startTime: null,
    description: '',
    runners: '',
    startOfficials: '',
    finishOfficials: '',
    address: '',
    latitude: null,
    longitude: null,
    distance: '',
    units: 'miles',
    elevation: '',
    difficulty: '',
    sponsors: '',
    prizes: '',
  });

  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is logged in on component mount
  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

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
    console.log('Place selected:', place);
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      
      setFormData({
        ...formData,
        address: place.formatted_address,
        latitude: lat,
        longitude: lng,
      });
      setGeocodeError('');
      
      // Log the location details
      console.log('Location found:', place.formatted_address);
      console.log('Coordinates:', lat.toFixed(4), lng.toFixed(4));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (
        !formData.name || 
        !formData.date || 
        !formData.startTime || 
        !formData.address ||
        !formData.runners ||
        !formData.startOfficials ||
        !formData.finishOfficials
    ) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      setError('Please select an address from the suggestions');
      return;
    }

    setSubmitting(true);

    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const eventDateTime = formData.date
        .hour(formData.startTime.hour())
        .minute(formData.startTime.minute())
        .second(0)
        .format('YYYY-MM-DD HH:mm:ss');

      const eventData = {
        name: formData.name,
        event_datetime: eventDateTime,
        timezone: userTimezone,
        latitude: formData.latitude,
        longitude: formData.longitude,
        description: formData.description || null,
        max_runners: parseInt(formData.runners),
        max_start_officials: parseInt(formData.startOfficials),
        max_finish_officials: parseInt(formData.finishOfficials),
        distance: parseFloat(formData.distance) || null,
        elevation: parseFloat(formData.elevation) || null,
        difficulty: formData.difficulty || null,
        sponsors: formData.sponsors || null,
        prizes: formData.prizes || null,
      };

      console.log('Creating event:', eventData);
      
      const response = await createEvent(eventData);
      console.log('Event created:', response);
      
      setSuccess('Event created successfully! Redirecting...');
      
      setTimeout(() => {
        navigate('/events');
      }, 2000);
      
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setSubmitting(false);
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
          Start a Race
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
            <Typography
              variant="h4"
              fontWeight={600}
              sx={{ mb: 3, fontWeight: 'semibold' }}
            >
              Event Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter the basics for your race.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

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
                    sx={{
                      mb: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      borderRadius: 1,
                    }}
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
                        sx: {
                          mb: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.85)',
                          borderRadius: 1,
                        },
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
                        sx: {
                          mb: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.85)',
                          borderRadius: 1,
                        },
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

                  <TextField
                    // Sam added
                    fullWidth
                    name="runners"
                    label="Max Number of Runners?"
                    value={formData.runners}
                    onChange={handleChange}
                    variant="filled"
                    type="number"
                    inputProps={{ min: 1, step: 'any' }}
                  />

                  <TextField
                    // Sam added
                    fullWidth
                    name="startOfficials"
                    label="Max Number of Officials?"
                    value={formData.startOfficials}
                    onChange={handleChange}
                    variant="filled"
                    type="number"
                    inputProps={{ min: 1, step: 'any' }}
                  />

                  <TextField
                    // Sam added
                    fullWidth
                    name="finishOfficials"
                    label="Max Number of Finish Line Officials?"
                    value={formData.finishOfficials}
                    onChange={handleChange}
                    variant="filled"
                    type="number"
                    inputProps={{ min: 1, step: 'any' }}
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
                    placeholder="Start typing an address..."
                  />

                  {geocodeError && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                      {geocodeError}
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    name="distance"
                    label="Distance"
                    type="number"
                    value={formData.distance}
                    onChange={handleChange}
                    variant="filled"
                  />
                  <TextField
                    select
                    fullWidth
                    name="units"
                    label="Units"
                    value={formData.units}
                    onChange={handleChange}
                    variant="filled"
                    sx={{
                      mb: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      borderRadius: 1,
                    }}
                  >
                    <MenuItem value="miles">Miles</MenuItem>
                    <MenuItem value="km">Kilometers</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    name="elevation"
                    label="Elevation Gain (ft or m)"
                    value={formData.elevation}
                    onChange={handleChange}
                    variant="filled"
                    type="number"
                    inputProps={{ min: 0, step: 'any' }}
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
                    Sponsors & Prizes (Optional)
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
                    placeholder="List any sponsors"
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
                    placeholder="Describe any prizes or awards"
                  />
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ mt: 4, mb: 4 }}
                  endIcon={submitting ? null : <RunCircleIcon />}
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Create Running Event'}
                </Button>
              </Box>
            </LocalizationProvider>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Create;
