import React from 'react';
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

const Create = () => {
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

            <Divider />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box component="form" noValidate>
                <Grid container spacing={2}>
                  <TextField
                    fullWidth
                    label="Event Name"
                    variant="filled"
                    sx={{
                      mb: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      borderRadius: 1,
                    }}
                  />
                  <DatePicker
                    label="Event Date"
                    slotProps={{
                      textField: {
                        variant: 'filled',
                        fullWidth: true,
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
                    slotProps={{
                      textField: {
                        variant: 'filled',
                        fullWidth: true,
                        sx: {
                          mb: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.85)',
                          borderRadius: 1,
                        },
                      },
                    }}
                  />

                  <TextField
                    label="Event Description"
                    variant="filled"
                    fullWidth
                    multiline
                    rows={4}
                  />

                  <TextField
                    fullWidth
                    label="Distance"
                    type="number"
                    variant="filled"
                  />
                  <TextField
                    select
                    fullWidth
                    label="Units"
                    variant="filled"
                    sx={{
                      mb: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      borderRadius: 1,
                    }}
                    defaultValue="miles" // optional default
                  >
                    <MenuItem value="miles">Miles</MenuItem>
                    <MenuItem value="km">Kilometers</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Elevation Gain (ft or m)"
                    variant="filled"
                    type="number"
                    inputProps={{ min: 0, step: 'any' }}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Difficulty"
                    variant="filled"
                  >
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Moderate">Moderate</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                  </TextField>
                  <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                    Sponsors & Prizes (Optional)
                  </Typography>

                  <TextField
                    fullWidth
                    label="Sponsors"
                    variant="filled"
                    multiline
                    rows={2}
                    placeholder="List any sponsors"
                  />

                  <TextField
                    fullWidth
                    label="Prizes"
                    variant="filled"
                    multiline
                    rows={2}
                    placeholder="Describe any prizes or awards"
                  />
                </Grid>
              </Box>
            </LocalizationProvider>
          </Stack>
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 4, mb: 4 }}
            endIcon={<RunCircleIcon />}
          >
            {' '}
            Create Running Event
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default Create;
