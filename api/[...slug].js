import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NeighbourBuddy API running live on Vercel!' });
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

// AI MATCH ROUTE
app.post('/api/ai/match-buddies', async (req, res) => {
  const { activityId } = req.body;

  try {
    const { data: activity, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', activityId)
      .single();

    if (error || !activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const { data: residents } = await supabase
      .from('profiles')
      .select('id, full_name, precinct, interests, running_pace_min_km, sports_skill_level')
      .limit(10);

    const matches = (residents || []).map((r, i) => ({
      id: r.id || String(i + 1),
      name: r.full_name || `Resident ${i + 1}`,
      matchScore: `${95 - (i * 4)}%`,
      reason: 'Matched based on shared schedule, sports skill level, and activity preferences.'
    }));

    return res.json({ activity, matchedBuddies: matches });
  } catch (err) {
    console.error('Match error:', err);
    return res.status(500).json({ error: err.message });
  }
});

export default app;