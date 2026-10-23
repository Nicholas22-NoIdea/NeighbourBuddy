import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini SDK with your environment key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Primary model first, backup second.
// If the backup ID gives a 404 in the logs, copy the correct ID from Google AI Studio.
const MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash-lite'];

/**
 * Calls Gemini with a short retry on busy errors (503/429),
 * then moves on to the backup model.
 */
async function generateWithRetry(prompt, generationConfig) {
  let lastError;

  for (const modelName of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig,
        });
        return await model.generateContent(prompt);
      } catch (err) {
        lastError = err;
        console.warn(`Gemini ${modelName} attempt ${attempt + 1} failed:`, err?.status, err?.message);

        const retryable = err?.status === 503 || err?.status === 429;
        if (!retryable) break; // not a busy error, go to the next model

        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

/**
 * Ranks candidate residents for an activity using Gemini
 */
export async function rankMatchedResidents(activity, residents) {
  // Default fallback data for presentation/demo safety
  const defaultFallback = [
    {
      id: 'res-1',
      full_name: 'Daniel Tan',
      precinct: 'Precinct 4',
      matchScore: '95%',
      reason: 'Matches intermediate badminton tier and weekend morning availability.',
      isDemo: true,
    },
    {
      id: 'res-2',
      full_name: 'Emily Wong',
      precinct: 'Precinct 2',
      matchScore: '88%',
      reason: 'Frequently joins racquet sports in Sports Hall Court 2.',
      isDemo: true,
    },
  ];

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️ GEMINI_API_KEY is missing in backend environment.');
      return defaultFallback;
    }

    if (!Array.isArray(residents) || residents.length === 0) {
      console.warn('⚠️ No residents found in the profiles table, returning demo data.');
      return defaultFallback;
    }

    const prompt = `
      Act as an AI resident matching engine for a local township community app.

      Activity Context:
      - Title: ${activity?.title || 'Community Event'}
      - Category: ${activity?.category || 'General'}
      - Required skill level: ${activity?.required_skill_level ?? 'Any'}
      - Venue: ${activity?.venue || 'Community Center'}

      Candidate Residents List:
      ${JSON.stringify(residents, null, 2)}

      Only recommend residents from the list above. Copy their id, full_name and precinct exactly.

      Evaluate candidates and return ONLY a JSON array with this exact format:
      [
        {
          "id": "resident_id",
          "full_name": "Resident Name",
          "precinct": "Precinct X",
          "matchScore": "Match % (e.g. 94%)",
          "reason": "1-sentence reason why this resident is a great buddy match."
        }
      ]
    `;

    const result = await generateWithRetry(prompt, {
      responseMimeType: 'application/json',
    });
    const text = result.response.text();

    // Clean any residual markdown formatting fences
    const cleanText = text.replace(/```json|```/g, '').trim();
    const parsedMatches = JSON.parse(cleanText);

    if (Array.isArray(parsedMatches) && parsedMatches.length > 0) {
      return parsedMatches;
    }

    return defaultFallback;
  } catch (error) {
    console.error('❌ Gemini rankMatchedResidents Error:', error);
    return defaultFallback;
  }
}

/**
 * Moderates chat messages for safety
 */
export async function moderateChatMessage(messageText) {
  try {
    if (!process.env.GEMINI_API_KEY) return { isSafe: true, reason: '' };

    const prompt = `Analyze this community chat message for hate speech, harassment, or severe profanity: "${messageText}". Respond in JSON: {"isSafe": true/false, "reason": "short explanation if unsafe"}`;

    const result = await generateWithRetry(prompt, {
      responseMimeType: 'application/json',
    });
    const cleanText = result.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (err) {
    console.error('Chat moderation error:', err);
    return { isSafe: true, reason: '' };
  }
}
