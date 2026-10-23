import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// 1. AI Safety & Group Chat Content Moderator
export async function moderateChatMessage(messageText: string): Promise<{ isSafe: boolean; reason?: string }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a community safety moderator for NeighbourBuddy, a local resident activity app. 
Analyze this message for safety, harassment, hate speech, or inappropriate spam: "${messageText}".
Respond ONLY in JSON format like this: {"isSafe": true} or {"isSafe": false, "reason": "short explanation"}.`
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (err) {
    console.error('AI Moderation Error:', err);
    return { isSafe: true };
  }
}

// 2. AI "Fill-a-Spot" Resident Matcher
export async function rankMatchedResidents(activity: any, candidateUsers: any[]) {
  try {
    const prompt = `You are NeighbourBuddy's AI matching engine. 
We need to fill a spot for the following activity:
- Title: ${activity.title}
- Category: ${activity.category}
- Venue: ${activity.venue}
- Target Pace/Skill: Level ${activity.required_skill_level}

Here is a list of candidate nearby residents within 2 km:
${JSON.stringify(candidateUsers)}

Rank candidates based on compatibility (skill/pace level match and shared interests). 
Return a JSON array of matched candidates with a compatibility percentage score (0-100%).
Example JSON format: [{"user_id": "123", "matchScore": 95, "matchReason": "Matched pace and shared interest"}]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const text = response.text || '[]';
    return JSON.parse(text);
  } catch (err) {
    console.error('AI Matcher Error:', err);
    return candidateUsers.map(u => ({ user_id: u.id, matchScore: 80, matchReason: 'Nearby resident match' }));
  }
}