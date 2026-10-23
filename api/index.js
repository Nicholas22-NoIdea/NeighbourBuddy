import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from '../backend/config/supabase.js'; // Adjust this path if your config folder is elsewhere
import { moderateChatMessage, rankMatchedResidents } from '../backend/services/aiService.js'; // Adjust path if needed

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NeighbourBuddy Backend & AI Engine running on Vercel!' });
});

// GET all activities
app.get('/api/activities', async (req, res) => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ activities: data });
});

// AI ROUTE 1: Fill-a-Spot Smart Buddy Matching
app.post('/api/ai/match-buddies', async (req, res) => {
  const { activityId } = req.body;

  // 1. Fetch activity details from Supabase
  const { data: activity, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', activityId)
    .single();

  if (error || !activity) return res.status(404).json({ error: 'Activity not found' });

  // 2. Fetch candidate residents
  const { data: residents } = await supabase
    .from('profiles')
    .select('id, full_name, precinct, interests, running_pace_min_km, sports_skill_level')
    .limit(10);

  // 3. Run AI ranking algorithm
  const matches = await rankMatchedResidents(activity, residents || []);

  res.json({ activity, matchedBuddies: matches });
});

// AI ROUTE 2: Moderated Group Chat Message Endpoint
app.post('/api/chat/send', async (req, res) => {
  const { activityId, senderId, messageText } = req.body;

  // 1. Moderate message with Gemini AI
  const moderation = await moderateChatMessage(messageText);

  if (!moderation.isSafe) {
    return res.status(400).json({ 
      error: 'Message flagged by AI Safety Filter', 
      reason: moderation.reason 
    });
  }

  // 2. Save safe message to Supabase
  const { data, error } = await supabase
    .from('group_messages')
    .insert([{ activity_id: activityId, sender_id: senderId, message_text: messageText }])
    .select();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ success: true, message: data[0] });
});

// DEBUG CATCH-ALL: Let's see what routes Express actually has registered
app._router.stack.forEach((layer) => {
  if (layer.route) {
    console.log(`Registered route: ${Object.keys(layer.route.methods)} ${layer.route.path}`);
  }
});

// Fallback catch-all to see any unhandled requests
app.all('*', (req, res) => {
  console.log(`⚠️ Express caught unhandled request: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found by Express', 
    receivedPath: req.originalUrl,
    method: req.method 
  });
});

// Export the Express app for Vercel Serverless
export default app;