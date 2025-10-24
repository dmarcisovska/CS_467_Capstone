import { Box, Typography, Button, Grid, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import heroImage from '../assets/running_feet.jpg';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import cardImgOne from '../assets/nature-run.jpg';
import cardImgTwo from '../assets/trail3.jpg';

function Home() {
  return (
    <>
      <Box
        sx={{
          height: '70vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: 'white',
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Crowd-Sourced Racing Events
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Join local running events, connect with the community, and race for
            fun!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/events"
          >
            Explore Races
          </Button>
        </Box>
      </Box>
      <Container
        maxWidth="lg"
        sx={{
          mt: 6,
        }}
      >
        <Box sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',}}>
          <Typography variant="h4" gutterBottom>
            Tired of spending money to participate in running marathon races?{' '}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{textAlign: 'center'}}>
            We offer a platform where users can search for free races to
            participate in. Don't see a race in your area? Create one! We
            welcome racers of all abilities and levels.{' '}
          </Typography>
        </Box>
      </Container>
      <Grid
        container
        spacing={3}
        sx={{
          mt: 4,
          mb: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid item xs={12} sm={6}>
          <Card sx={{ maxWidth: 345, mx: 'auto' }}>
            <CardActionArea component={Link} to="/events">
              <CardMedia
                component="img"
                height="140"
                image={cardImgOne}
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Events
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Search our database of the latest free running races you can
                  participate in.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ maxWidth: 345, mx: 'auto' }}>
            <CardActionArea component={Link} to="/create">
              <CardMedia
                component="img"
                height="140"
                image={cardImgTwo}
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Create an Event
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Want to create your own event? Create one on the page below.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default Home;
