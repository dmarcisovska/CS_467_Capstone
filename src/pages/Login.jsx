import React from 'react'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';




const Login = () => {
  return (
   
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: 128,
          height: 128,
          padding: 2,
        },
      }}
    >
      <Paper>
           <Typography variant="button" gutterBottom sx={{ display: 'block' }}>
        Login
      </Typography>
      </Paper>
    </Box>
  )
}

export default Login