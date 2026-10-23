import { createClient } from '@supabase/supabase-js';

// Initialize Supabase using environment variables
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { activityId } = req.body;

    if (!activityId) {
      return res.status(400).json({ error: 'Activity ID is required' });
    }

    // 1. Fetch activity details from Supabase
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('*')
      .eq('id', activityId)
      .single();

    if (activityError) throw activityError;

    // 2. Perform your AI matching logic or query potential buddies
    // (If you have existing matching logic from your Render backend, paste it here!)
    // For now, let's return a clean mock or fetched match response:
    const mockMatches = [
      { id: '1', name: 'Local Resident Alex', matchScore: '95%', reason: 'Matching skill level & schedule' },
      { id: '2', name: 'Sarah Jenkins', matchScore: '88%', reason: 'Active in same community sports group' }
    ];

    return res.status(200).json({ 
      success: true, 
      activity, 
      matches: mockMatches 
    });

  } catch (error) {
    console.error('AI match-buddies error:', error);
    return res.status(500).json({ error: error.message });
  }
}