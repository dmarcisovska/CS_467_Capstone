import express from 'express';
import "dotenv/config";

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('Google Maps API key not configured');
      return res.status(500).json({ error: 'Geocoding service not configured' });
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    console.log('Geocoding status:', data.status);

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      res.json({
        lat: location.lat,
        lng: location.lng,
        formatted_address: data.results[0].formatted_address,
      });
    } else {
      res.status(404).json({ error: `Address not found: ${data.status}` });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: 'Geocoding service error' });
  }
});

export default router;
