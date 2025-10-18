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
import heroImage from '../assets/trail_2.jpg'; 

const Create = () => {
  return (
    <>
      {/* <Box
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
          New Race
        </Typography>
      </Box> */}
       <Box
      sx={{
        height: '100vh',
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        // backgroundPosition: 'center',
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        // position: 'relative',
      }}>
    
      <Container sx={{ pt: 12 }} >
        <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, opacity: .8 }}>
          <Stack spacing={2}>
            <Typography variant="h4" fontWeight={600}>
              Event Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter the basics for your race. 
            </Typography>

            <Divider />
            <Box component="form" noValidate>
              <Grid container spacing={2}>
                <TextField fullWidth label="Event Name" />
                <TextField
                  label="Event Description"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                />

                <TextField fullWidth label="Location (parking / map notes)" />

                <TextField fullWidth label="Distance" type="number" />
                <TextField select fullWidth label="Units"></TextField>
                <TextField
                  fullWidth
                  label="Elevation Gain (ft or m)"
                  type="number"
                  inputProps={{ min: 0, step: 'any' }}
                />
              </Grid>
            </Box>
          </Stack>
       
        </Paper>
           <Button variant="contained" size="large" sx={{mt: 2}} endIcon={<RunCircleIcon />}> Create Running Event</Button>
      </Container>
      </Box>
    </>
  );
};

export default Create;
