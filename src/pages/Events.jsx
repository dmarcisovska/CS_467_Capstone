import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Paper } from '@mui/material';

import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import titleImg from '../assets/gigi-bIpKSEsaN6Q-unsplash.jpg';
import { fetchEvents } from '../services/api';
// import cardImg from '../assets/trail.jpg'; // unused
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);


  useEffect(() => {
    console.log('Requesting geolocation...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Got position:', position.coords);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        
          loadEvents();
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Cant retrieve user location');
        }
      );
    } else {
      console.error('Geolocation not supported');
      setLocationError('Geolocation not supported by browser');
    }
  }, []);

  const loadEvents = useCallback(async (isBackgroundRefresh = false) => {
    try {
      if (!isBackgroundRefresh) setLoading(true);
      setError(null);
      
      console.log('Loading events with location:', userLocation);
      
      const data = await fetchEvents({
        sortBy,
        dateFilter,
        lat: userLocation?.lat,
        lng: userLocation?.lng,
      });
      
      console.log('Events received:', data);
      console.log('First event distance:', data[0]?.distance_miles);
      
      if (isBackgroundRefresh) {
        setEvents(prevEvents => {
          
          // compare data to prevent unnecessary re-renders
          if (JSON.stringify(prevEvents) === JSON.stringify(data)) {
            return prevEvents; // prevents re-render
          }
          return data;
        });

      } else {
        setEvents(data);
      }

    } catch (err) {
      console.error('Failed to load events: ', err); // or unset err in catch
      setError('Failed to load events. Please try again later.');
    } finally {
      if (!isBackgroundRefresh) setLoading(false);
    }
  }, [sortBy, dateFilter, userLocation]);

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

  // Initial event data fetch on page load
  useEffect(() => {
    loadEvents(false); // not a background refresh
  }, [loadEvents]); 

  // Background refresh
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!document.hidden) { // do not refresh if tab is inactive
        loadEvents(true);
      }
    }, 30000 ); // 30000ms = 30 seconds

    // Cleanup between background refreshes
    // Helps avoids memory leak and duplication issues
    return () => clearInterval(intervalId);
  }, [loadEvents]);

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
          Upcoming Races
        </Typography>
      </Box>
      <Container sx={{ py: 4 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <TextField
            select
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="date">Date (Soonest First)</MenuItem>
            <MenuItem value="participants">Most Participants</MenuItem>
            {userLocation && (
              <MenuItem value="distance">Distance (Nearest First)</MenuItem>
            )}
          </TextField>

          <TextField
            select
            label="Date Filter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Events</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
          </TextField>
        </Stack>

        {locationError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {locationError}. Distance sorting unavailable.
          </Alert>
        )}

        {!userLocation && !locationError && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Enable location to see distances and sort by nearest events.
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            {events.length === 0 ? (
              <Typography variant="h6" sx={{ textAlign: 'center', py: 8 }}>
                No events found with your search criteria. 
              </Typography>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                {events.map((event) => (
                  <Box
                    key={event.event_id}
                    sx={{
                      flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' },
                      display: 'flex',
                    }}
                  >
                    <Card
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {event.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {event.description}
                        </Typography>

                        <Stack spacing={1}>
                          <Typography variant="body2">
                            <strong>Date:</strong>{' '}
                            {formatDate(event.event_datetime)}
                          </Typography>

                          {event.distance_miles && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LocationOnIcon fontSize="small" color="primary" />
                              <Typography variant="body2">
                                <strong>{Math.round(event.distance_miles)}</strong> miles away
                              </Typography>
                            </Box>
                          )}

                          <Typography variant="body2">
                            <strong>Distance:</strong> {event.distance} miles
                          </Typography>

                          {event.elevation && (
                            <Typography variant="body2">
                              <strong>Elevation:</strong> {event.elevation} ft
                            </Typography>
                          )}

                          <Box
                            sx={{
                              display: 'flex',
                              gap: 1,
                              flexWrap: 'wrap',
                              mt: 1,
                            }}
                          >
                            {event.difficulty && (
                              <Chip
                                label={event.difficulty}
                                color={getDifficultyColor(event.difficulty)}
                                size="small"
                              />
                            )}
                            <Chip
                              label={`${
                                event.participant_count || 0
                              } participants`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Stack>
                      </CardContent>

                      <CardActions sx={{ mb: 2 }}>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/events/${event.event_id}`)}
                        >
                          View Details
                        </Button>
                        <Button variant="outlined" size="small" color="primary">
                          Register
                        </Button>
                      </CardActions>
                    </Card>
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Events;
