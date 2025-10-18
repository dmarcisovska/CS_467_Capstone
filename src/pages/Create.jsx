import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import titleImg from '../assets/two_runners.jpg'

const Create = () => {
  return (
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
        New Race
      </Typography>
    </Box>
  )
}

export default Create