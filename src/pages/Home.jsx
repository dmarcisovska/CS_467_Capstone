import { Box, Typography, Button } from "@mui/material";
import { Link } from 'react-router-dom'; 
import heroImage from "../assets/running.jpg"

 function Home() {
  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white",
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      />

 
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Crowd-Sourced Racing Events
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Join local running events, connect with the community, and race for fun!
        </Typography>
        <Button variant="contained" color="primary" size="large" component={Link}
          to='/events' >
          Explore Events
        </Button>
      </Box>
    </Box>
  );
}

export default Home;