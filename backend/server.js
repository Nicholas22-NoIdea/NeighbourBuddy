import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. GET Activities Endpoint
app.get('/api/activities', async (req, res) => {
  res.json({
    activities: [
      { id: '1', title: 'Morning 5K Jog', venue: 'Central Park', spots_left: 5, category: 'Sports' },
      { id: '2', title: 'Weekend Badminton Doubles', venue: 'Community Hall Court 2', spots_left: 3, category: 'Sports' },
      { id: '3', title: 'Board Games & Coffee', venue: 'Clubhouse Lounge', spots_left: 4, category: 'Social' }
    ]
  });
});

// 2. POST Register Event Endpoint
app.post('/api/activities/:id/register', async (req, res) => {
  const { id } = req.params;
  console.log(`Received registration request for event ID: ${id}`);

  return res.status(200).json({ 
    success: true, 
    message: `Successfully registered for event ${id}!` 
  });
});

app.post('/api/ai/match-buddies', async (req, res) => {
  const { activityId } = req.body;
  console.log(`Received AI match request for activity ID: ${activityId}`);

  // Return a successful response with mock or real matches
  return res.status(200).json({
    success: true,
    matches: [
      { id: '1', name: 'Alex Tan', matchScore: '95%', reason: 'Similar skill level and schedule' },
      { id: '2', name: 'Priya', matchScore: '88%', reason: 'Active in community sports' }
    ]
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Express Backend running on http://localhost:${PORT}`);
});

// Add a default root route
app.get('/', (req, res) => {
  res.status(200).send('🚀 NeighbourBuddy Express Backend is running live on Render!');
});

// Export the Express app for Vercel Serverless Functions
module.exports = app;

// Only listen locally if not running in production (Vercel handles the listener in production)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Express Backend running on http://localhost:${PORT}`);
  });
}