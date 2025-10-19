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
import titleImg from '../assets/two_runners.jpg';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RunCircleIcon from '@mui/icons-material/RunCircle';
import heroImage from '../assets/venti-views-sxzpqUHy9Gs-unsplash.jpg';

const Create = () => {
  return (
      <Box
        sx={{
          height: '100vh',
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          position: 'relative',
          // backgroundPosition: 'center',
          // display: 'flex',
          // justifyContent: 'center',
          // alignItems: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 0,
          }}
        /> 
        <Container sx={{ pt: 12, zIndex: 1, position: 'relative' }}>
          <Stack spacing={2}>
            <Typography
              variant="h2"
              fontWeight={600}
              sx={{ mb: 3, fontWeight: 'bold', color: 'white' }}
            >
              Event Details
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ color: 'white' }}
            >
              Enter the basics for your race.
            </Typography>

            <Divider />
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
                <TextField
                  label="Event Description"
                  variant="filled"
                  fullWidth
                  multiline
                  rows={4}
                  sx={{
                    mb: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    borderRadius: 1,
                  }}
                />

                <TextField
                  fullWidth
                  label="Location (parking / map notes)"
                  variant="filled"
                  sx={{
                    mb: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    borderRadius: 1,
                  }}
                />

                <TextField
                  fullWidth
                  label="Distance"
                  type="number"
                  variant="filled"
                  sx={{
                    mb: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    borderRadius: 1,
                  }}
                />
                <TextField
                  select
                  fullWidth
                  label="Units "
                  variant="filled"
                  sx={{
                    mb: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    borderRadius: 1,
                  }}
                ></TextField>
                <TextField
                  fullWidth
                  label="Elevation Gain (ft or m)"
                  variant="filled"
                  type="number"
                  inputProps={{ min: 0, step: 'any' }}
                  sx={{
                    mb: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    borderRadius: 1,
                  }}
                />
              </Grid>
            </Box>
          </Stack>
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            endIcon={<RunCircleIcon />}
          >
            {' '}
            Create Running Event
          </Button>
        </Container>
      </Box>
  );
};

export default Create;
