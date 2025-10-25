import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
3;
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

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
import cardImg from '../assets/trail.jpg';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEvents({ sortBy, dateFilter });
      setEvents(data);
      console.log('Events loaded:', data); // Move it here to log the data
    } catch (err) {
      setError('Failed to load events. Please try again later.');
    } finally {
      // Remove the console.log from here
      setLoading(false);
    }
  };

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
    loadEvents();
  }, [sortBy, dateFilter]);

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

        {/* Title text */}
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
                No events found. Try adjusting your filters.
              </Typography>
            ) : (
              <Grid>
                {events.map((event) => (
                  <Card sx={{ mb: 4 }} key={event.event_id}>
                    <CardMedia
                      sx={{ height: 100 }}
                      image={cardImg}
                      title="green iguana"
                    />
                    <CardContent>
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

                    <CardActions>
                      <Button variant="contained" size="small" color="primary">
                        View Details
                      </Button>
                      <Button variant="outlined" size="small" color="primary">
                        Register
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Events;
