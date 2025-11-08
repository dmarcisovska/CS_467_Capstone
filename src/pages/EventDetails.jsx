import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TerrainIcon from '@mui/icons-material/Terrain';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import titleImg from '../assets/james-lee-_QvszySFByg-unsplash.jpg';
import { fetchEventById } from '../services/api';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEventById(id);
      setEvent(data);
      console.log('Event loaded:', data);
    } catch (err) {
      setError('Failed to load event details.');
      console.error('Error loading event:', err);
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (!event?.event_datetime) return;

    const calculateTimeLeft = () => {
      const eventDate = new Date(event.event_datetime);
      const now = new Date();
      const difference = eventDate - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isPast: false,
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [event]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: 'success',
      Moderate: 'warning',
      Hard: 'error',
    };
    return colors[difficulty] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Event not found'}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/events')}
        >
          Back to Events
        </Button>
      </Container>
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
          {event.name}
        </Typography>
      </Box>

      <Container sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/events')}
          sx={{ mb: 3 }}
        >
          Back to Events
        </Button>

 {/* <Typography variant="h3" gutterBottom>Countdown to Race Day</Typography> */}
            {timeLeft && !timeLeft.isPast && (
              <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3, borderRadius: 2, mb: 4 }}>
                {/* <Typography 
                  variant="h3" 
                  gutterBottom 
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}
                >Race Countdown
  
                </Typography> */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="bold">
                      {timeLeft.days}
                    </Typography>
                    <Typography variant="body2">Days</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="bold">
                      {timeLeft.hours}
                    </Typography>
                    <Typography variant="body2">Hours</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="bold">
                      {timeLeft.minutes}
                    </Typography>
                    <Typography variant="body2">Minutes</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="bold">
                      {timeLeft.seconds}
                    </Typography>
                    <Typography variant="body2">Seconds</Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {timeLeft?.isPast && (
              <Alert severity="info" sx={{ mb: 4 }}>
                This event has already taken place.
              </Alert>
            )}

        <Paper sx={{ p: 4 }}>
          <Stack spacing={4}>
            

          

           

            <Box>
              <Typography variant="h3" gutterBottom fontWeight={400}>
                About This Race
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {event.description || 'No description available.'}
              </Typography>
            </Box>

             <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {event.difficulty && (
                <Chip
                  label={event.difficulty}
                  color={getDifficultyColor(event.difficulty)}
                  size="large"
                />
              )}
              <Chip
                icon={<PeopleIcon />}
                label={`${event.participant_count || 0} participants`}
                variant="outlined"
                size="large"
              />
            </Box>

            <Box>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <CalendarTodayIcon fontSize="small" color="primary" />
                Date & Time
              </Typography>
              <Typography variant="body1">
                {formatDate(event.event_datetime)}
              </Typography>
            </Box>

            <Box>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <LocationOnIcon fontSize="small" color="primary" />
                Location
              </Typography>
              <Typography variant="body1">
                {event.latitude && event.longitude ? (
                  <>Coordinates: {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}</>
                ) : (
                  'Location not specified'
                )}
              </Typography>
            </Box>

            <Box>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <TerrainIcon fontSize="small" color="primary" />
                Course Details
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body1">
                  <strong>Distance:</strong> {event.distance} miles
                </Typography>
                {event.elevation && (
                  <Typography variant="body1">
                    <strong>Elevation Gain:</strong> {event.elevation} ft
                  </Typography>
                )}
              </Stack>
            </Box>

            <Box sx={{ pt: 2 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ maxWidth: 400 }}
                onClick={() => alert('Registered')}
              >
                Register for race
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </>
  );
};

export default EventDetails;
