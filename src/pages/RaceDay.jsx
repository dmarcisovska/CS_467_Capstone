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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import titleImg from '../assets/gigi-bIpKSEsaN6Q-unsplash.jpg';
import { fetchEventById, generateQRCode, setStartTime } from '../services/api';

const RaceDay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [startTimeSet, setStartTimeSet] = useState(false);

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

  const handleStartRace = async () => {
    try {
      await setStartTime(id);
      setStartTimeSet(true);
      alert('Race started! Start time recorded for all participants.');
    } catch (err) {
      alert(err.message || 'Failed to start race');
    }
  };

  const handleShowQR = async (participant) => {
    try {
      setSelectedParticipant(participant);
      const svg = await generateQRCode(id, participant.user_id);
      setQrCode(svg);
      setQrDialogOpen(true);
    } catch (err) {
      alert('Failed to generate QR code');
    }
  };

  const handleDownloadQR = () => {
    const blob = new Blob([qrCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-code-${selectedParticipant.username}.svg`;
    link.click();
    URL.revokeObjectURL(url);
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

  // Replace the mock participants with actual data from event
  const participants = event.volunteers 
    ? event.volunteers.filter(v => v.role === 'Runner')
    : [];

  // If no participants in volunteers, show message
  if (participants.length === 0) {
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
            Race Day: {event.name}
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

          <Alert severity="info">
            No participants registered as runners for this event yet.
          </Alert>
        </Container>
      </>
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
          Race Day: {event.name}
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

        <Paper sx={{ p: 4, mb: 4 }}>
          <Stack spacing={4}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Race Controls
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {formatDate(event.event_datetime)}
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={handleStartRace}
                disabled={startTimeSet}
                sx={{ mt: 2 }}
              >
                {startTimeSet ? 'Race Started' : 'Start Race'}
              </Button>
              
              {startTimeSet && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Race started! All participant start times have been recorded.
                </Alert>
              )}
            </Box>

            <Box>
              <Typography variant="h5" gutterBottom>
                Participants ({participants.length})
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                {participants.map((participant) => (
                  <Box
                    key={participant.user_id}
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
                      <QrCode2Icon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      
                      <Typography variant="body1" fontWeight={600}>
                        {participant.username}
                      </Typography>
                      
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {participant.start_time && (
                          <Chip 
                            icon={<CheckCircleIcon />}
                            label="Started" 
                            color="success" 
                            size="small" 
                          />
                        )}
                        {participant.finish_time ? (
                          <Chip 
                            icon={<CheckCircleIcon />}
                            label="Finished" 
                            color="success" 
                            size="small" 
                          />
                        ) : participant.start_time ? (
                          <Chip 
                            icon={<PendingIcon />}
                            label="Racing" 
                            color="warning" 
                            size="small" 
                          />
                        ) : (
                          <Chip 
                            label="Not Started" 
                            size="small" 
                            variant="outlined"
                          />
                        )}
                      </Stack>
                      
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<QrCode2Icon />}
                        onClick={() => handleShowQR(participant)}
                        sx={{ mt: 2 }}
                      >
                        View QR Code
                      </Button>
                    </Paper>
                  </Box>
                ))}
              </Box>
            </Box>
          </Stack>
        </Paper>

        {/* QR Code Dialog */}
        <Dialog 
          open={qrDialogOpen} 
          onClose={() => setQrDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            QR Code for {selectedParticipant?.username}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              {qrCode && (
                <div dangerouslySetInnerHTML={{ __html: qrCode }} />
              )}
            </Box>
            <Alert severity="info" sx={{ mt: 2 }}>
              Scan this QR code at the finish line to record finish time
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDownloadQR} startIcon={<DownloadIcon />}>
              Download
            </Button>
            <Button onClick={() => setQrDialogOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default RaceDay;
