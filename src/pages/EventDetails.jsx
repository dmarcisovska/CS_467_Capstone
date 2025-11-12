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
import { fetchEventById, deleteEvent, registerForEvent } from '../services/api';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [address, setAddress] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

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

  useEffect(() => {
    if (event?.latitude && event?.longitude) {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${event.latitude},${event.longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`)
        .then(res => res.json())
        .then(data => {
          if (data.results && data.results[0]) {
            setAddress(data.results[0].formatted_address);
          }
        })
        .catch(err => console.error('Error getting address:', err));
    }
  }, [event]);

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

  useEffect(() => {
    // Check if logged-in user is the event creator or already registered
    const storedUser = localStorage.getItem('user');
    if (storedUser && event) {
      const user = JSON.parse(storedUser);
      setIsCreator(user.user_id === event.creator_user_id);
      
      // Check if user is already registered (check volunteers or would need registrations data)
      // For now, we'll just check volunteers array
      const alreadyRegistered = event.volunteers?.some(v => v.user_id === user.user_id);
      setIsRegistered(alreadyRegistered);
    }
  }, [event]);

  const handleRegister = async () => {
    const user = localStorage.getItem('user');
    
    if (!user) {
      navigate('/login');
      return;
    }

    setRegistering(true);
    
    try {
      await registerForEvent(id);
      alert('Successfully registered for event!');
      // Reload event details
      loadEvent();
    } catch (err) {
      alert(err.message || 'Failed to register for event');
    } finally {
      setRegistering(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteEvent(id);
      alert('Event deleted successfully');
      navigate('/events');
    } catch (err) {
      alert('Failed to delete event: ' + err.message);
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
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

        {!isCreator && !isRegistered && (
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={handleRegister}
              disabled={registering}
            >
              {registering ? <CircularProgress size={24} /> : 'Register for Event'}
            </Button>
          </Box>
        )}

        {isRegistered && (
          <Alert severity="success" sx={{ mb: 3 }}>
            You are registered for this event!
          </Alert>
        )}

            {timeLeft && !timeLeft.isPast && (
              <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3, borderRadius: 2, mb: 4 }}>
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

        <Paper sx={{ p: 4, position: 'relative' }}>
          {/* Show Edit and Delete buttons if user is the creator */}
          {isCreator && (
            <Box sx={{ mb:4, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/events/${id}/edit`)}
              >
                Edit Event
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
              >
                Delete Event
              </Button>
            </Box>
          )}

          <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {event.difficulty && (
              <Chip
                label={event.difficulty}
                color={getDifficultyColor(event.difficulty)}
                sx={{ height: '40px', fontSize: '1rem', fontWeight: 600 }}
              />
            )}
            <Chip
              icon={<PeopleIcon />}
              label={`${event.participant_count || 0} participants`}
              variant="outlined"
              sx={{ height: '40px', fontSize: '1rem' }}
            />
          </Box>

          <Stack spacing={4}>
            <Box>
              <Typography variant="h3" fontWeight={400} sx={{ mb: 1 }}>
                About
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {event.description || 'No description available.'}
              </Typography>
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
              {event.latitude && event.longitude ? (
                <>
                  {address && (
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {address}
                    </Typography>
                  )}
                  <Box sx={{ mt: 2, borderRadius: 2, overflow: 'hidden', height: 400 }}>
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address || `${event.latitude},${event.longitude}`)}&zoom=15`}
                      allowFullScreen
                    />
                  </Box>
                </>
              ) : (
                <Typography variant="body1">Location not specified</Typography>
              )}
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

            {/* Sponsors & Prizes Section - Always show heading */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Sponsors & Prizes
              </Typography>
              {event.sponsors && event.sponsors.length > 0 && event.sponsors.some(s => s.sponsor || s.prize) ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  {event.sponsors
                    .filter(s => s.sponsor || s.prize)
                    .map((sponsorData) => (
                      <Box
                        key={sponsorData.id}
                        sx={{
                          flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 11px)' },
                          display: 'flex',
                        }}
                      >
                        <Paper sx={{ 
                          p: 2, 
                          bgcolor: 'grey.50',
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center'
                        }}>
                          <EmojiEventsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                          {sponsorData.sponsor && (
                            <Typography variant="body1" fontWeight={600}>
                              {sponsorData.sponsor}
                            </Typography>
                          )}
                          {sponsorData.prize && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: sponsorData.sponsor ? 0.5 : 0 }}>
                              {sponsorData.sponsor ? 'Prize: ' : ''}{sponsorData.prize}
                            </Typography>
                          )}
                        </Paper>
                      </Box>
                    ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No sponsors or prizes for this event
                </Typography>
              )}
            </Box>

            {event.volunteers && event.volunteers.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Event Officials & Volunteers
                </Typography>
                <Stack spacing={2}>
                  {event.volunteers.filter(v => v.role === 'Starting Official').length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Starting Officials
                      </Typography>
                      <Stack spacing={0.5}>
                        {event.volunteers
                          .filter(v => v.role === 'Starting Official')
                          .map((volunteer, index) => (
                            <Typography key={index} variant="body2">
                              • {volunteer.username}
                            </Typography>
                          ))}
                      </Stack>
                    </Box>
                  )}

                  {event.volunteers.filter(v => v.role === 'Finish Line Official').length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Finish Line Officials
                      </Typography>
                      <Stack spacing={0.5}>
                        {event.volunteers
                          .filter(v => v.role === 'Finish Line Official')
                          .map((volunteer, index) => (
                            <Typography key={index} variant="body2">
                              • {volunteer.username}
                            </Typography>
                          ))}
                      </Stack>
                    </Box>
                  )}
                  {event.volunteers.filter(v => v.role === 'Volunteer').length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Volunteers
                      </Typography>
                      <Stack spacing={0.5}>
                        {event.volunteers
                          .filter(v => v.role === 'Volunteer')
                          .map((volunteer, index) => (
                            <Typography key={index} variant="body2">
                              • {volunteer.username}
                            </Typography>
                          ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Box>
            )}

            {event.roles && event.roles.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Volunteer Opportunities
                </Typography>
                <Stack spacing={1}>
                  {event.roles.map((role, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">
                        {role.role}
                      </Typography>
                      <Chip 
                        label={`${role.current_count || 0}/${role.role_limit} filled`}
                        size="small"
                        color={role.current_count >= role.role_limit ? 'error' : 'success'}
                        variant="outlined"
                      />
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            <Box sx={{ pt: 2 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ maxWidth: 400 }}
                onClick={() => alert('Registered')}
              >
                Register 
              </Button>
            </Box>
          </Stack>
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>Delete Event?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete "{event?.name}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} disabled={deleting}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
              disabled={deleting}
            >
              {deleting ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default EventDetails;
