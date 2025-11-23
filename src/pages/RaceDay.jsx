import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QrCodeIcon from '@mui/icons-material/QrCode';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { API_BASE_URL } from "../services/api";

const RaceDay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [raceStarted, setRaceStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  
  const [finalists, setFinalists] = useState([]);
  const [runnerCount, setRunnerCount] = useState(0);

  // Mock data - replace with actual API calls
  const mockFinalists = [
    { username: 'Alice Runner', elapsed_time: '01:23:45', user_id: '1' },
    { username: 'Bob Racer', elapsed_time: '01:25:12', user_id: '2' },
    { username: 'Charlie Fast', elapsed_time: '01:27:33', user_id: '3' },
  ];

  useEffect(() => {
    // TODO: Replace with actual API calls
    loadRaceDay();
  }, [id]);



const loadRaceDay = async () => {
  try {
    setLoading(true);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token =
      localStorage.getItem("firebase_id_token") ||
      localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    // 1. Get event details (use API_BASE_URL like EventDetails)
    const eventRes = await fetch(`${API_BASE_URL}/api/events/${id}`);
    const eventData = await eventRes.json();

    setRaceStarted(!!eventData.start_time);

    if (!eventRes.ok || !eventData) {
      console.error("Event fetch failed:", eventData);
      setEvent(null);
      setLoading(false);
      return;
    }

    setEvent(eventData);

    // 2. Determine user role from event data
    let role = null;

    if (eventData.volunteers) {
      const volunteer = eventData.volunteers.find(
        v => v.user_id === storedUser.user_id
      );
      if (volunteer) role = volunteer.role;
    }

    if (!role && eventData.participants) {
      const participant = eventData.participants.find(
        p => p.user_id === storedUser.user_id
      );
      if (participant) role = "Runner";
    }

    setUserRole(role);

    // 3. Get leaderboard
    const lbRes = await fetch(`${API_BASE_URL}/api/events/${id}/finalists`);
    const lbData = await lbRes.json();

    if (lbRes.ok && lbData.runners) {
      setFinalists(lbData.runners);
      setRunnerCount(lbData.count);
    } else {
      setFinalists([]);
      setRunnerCount(0);
    }

    setLoading(false);

  } catch (err) {
    console.error("RaceDay load error:", err);
    setLoading(false);
  }
};



const handleStartRace = async () => {
  try {
    const token =
      localStorage.getItem("firebase_id_token") ||
      localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/api/raceday/set-start-time?event=${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Start race failed:", err);
      alert("Failed to start race: " + err);
      return;
    }

    alert("Race started!");
    setRaceStarted(true);

  } catch (err) {
    console.error(err);
    alert("Error starting race");
  }
};

  const handleOpenScanner = () => {
    // TODO: Open QR code scanner
    alert('QR Scanner would open here (requires camera library integration)');
  };

  const formatElapsedTime = (elapsed) => {
  if (!elapsed) return "N/A";

  // backend object format: { minutes: 12, seconds: 30 }
  if (typeof elapsed === "object") {
    const mins = elapsed.minutes ?? 0;
    const secs = elapsed.seconds ?? 0;

    const paddedM = String(mins).padStart(2, "0");
    const paddedS = String(secs).padStart(2, "0");

    return `${paddedM}:${paddedS}`;
  }

  // fallback if backend later sends a string
  return elapsed;
};

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading Race Day...</Typography>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Event not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/events')}
          sx={{ mt: 2 }}
        >
          Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/events/${id}`)}
        sx={{ mb: 3 }}
      >
        Back to Event Details
      </Button>

      <Typography
        variant="h3"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
      >
        <TimerIcon fontSize="large" color="primary" />
        Race Day: {event.name}
      </Typography>

      {!userRole && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You are not registered for this event. Viewing as spectator.
        </Alert>
      )}

      <Stack spacing={3}>
        {userRole === 'Starting Official' && (
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <PlayArrowIcon color="primary" />
              Starting Official Controls
            </Typography>
            <Divider sx={{ my: 2 }} />

            {!raceStarted ? (
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Click the button below to start the race. This will record the
                  official start time for all runners.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleStartRace}
                  color="success"
                  sx={{ fontSize: '1.2rem', py: 2, px: 4 }}
                >
                  Start Race
                </Button>
              </Box>
            ) : (
              <Alert severity="success" icon={<CheckCircleIcon />}>
                Race started at {new Date().toLocaleTimeString()}. Official
                timing is active.
              </Alert>
            )}
          </Paper>
        )}

        {userRole === 'Finish Line Official' && (
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <QrCodeIcon color="primary" />
              Finish Line Official Controls
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" sx={{ mb: 2 }}>
              Scan runner QR codes as they finish. The system will automatically
              record their finish time.
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<QrCode2Icon />}
              onClick={handleOpenScanner}
              color="primary"
              sx={{ fontSize: '1.1rem', py: 1.5, px: 3 }}
            >
              Open QR Code Scanner
            </Button>

            <Alert severity="info" sx={{ mt: 3 }}>
              <strong>Instructions:</strong>
              <ul style={{ marginTop: '8px', marginBottom: 0 }}>
                <li>Ask runners to show their QR code</li>
                <li>Scan the code using your device camera</li>
                <li>Verify the runner's name appears on screen</li>
                <li>Finish time is recorded automatically</li>
              </ul>
            </Alert>
          </Paper>
        )}

        {userRole === 'Runner' && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <QrCode2Icon color="primary" />
              Your Runner QR Code
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                bgcolor: 'grey.100',
                p: 4,
                borderRadius: 2,
                display: 'inline-block',
              }}
            >
              {/* TODO: Replace with actual QR code from backend */}
              <Box
                sx={{
                  width: 250,
                  height: 250,
                  bgcolor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid',
                  borderColor: 'grey.300',
                }}
              >
                <QrCode2Icon sx={{ fontSize: 200, color: 'grey.400' }} />
              </Box>
            </Box>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 3, maxWidth: 500, mx: 'auto' }}
            >
              Show this QR code to Finish Line Officials when you complete the
              race. Your finish time will be recorded automatically.
            </Typography>

          </Paper>
        )}

        <Paper sx={{ p: 3 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <EmojiEventsIcon color="primary" />
            Live Leaderboard
          </Typography>
          <Divider sx={{ my: 2 }} />

          {finalists.length === 0 ? (
  <Box sx={{ textAlign: 'center', py: 4 }}>
    <TimerIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
    <Typography color="text.secondary">
      No finishers yet. The leaderboard will update as runners complete the race.
    </Typography>
  </Box>
) : (
  <List>
    {finalists.map((runner, index) => (
      <ListItem
        key={runner.user_id}
        sx={{
          border: '1px solid',
          borderColor: 'grey.300',
          borderRadius: 1,
          mb: 1,
          bgcolor:
            index < 3
              ? `rgba(25, 118, 210, ${0.05 * (4 - index)})`
              : 'transparent',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ width: '100%' }}
        >
          <Chip
            label={`#${index + 1}`}
            color={
              index === 0
                ? 'primary'
                : index === 1
                ? 'secondary'
                : 'default'
            }
            sx={{
              minWidth: 60,
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          />
          <ListItemText
            primary={
              <Typography variant="h6" component="span">
                {runner.username}
              </Typography>
            }
            secondary={
              <Typography variant="body2" color="text.secondary">
                Time: {formatElapsedTime(runner.elapsed_time)}
              </Typography>
            }
          />
          {index < 3 && (
            <EmojiEventsIcon
              sx={{
                color:
                  index === 0
                    ? 'gold'
                    : index === 1
                    ? 'silver'
                    : '#CD7F32',
                fontSize: 32,
              }}
            />
          )}
        </Stack>
      </ListItem>
    ))}
  </List>
)}

          <Alert variant="filled" severity="info" iconMapping={{
    info: <DirectionsRunIcon fontSize="inherit" />,
  }}>
 This leaderboard updates in real-time as runners cross the finish line.
</Alert>
        </Paper>

        {userRole && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Race Statistics
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={2}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body1">Total Runners:</Typography>
                <Chip label="150" color="primary" />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body1">Finished:</Typography>
                <Chip label={mockFinalists.length} color="success" />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body1">In Progress:</Typography>
                <Chip label={150 - mockFinalists.length} color="warning" />
              </Box>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
};

export default RaceDay;
