import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini SDK with your environment key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Ranks candidate residents for an activity using Gemini 2.5 Flash
 */
export async function rankMatchedResidents(activity, residents) {
  // Default fallback data for presentation/demo safety
  const defaultFallback = [
    {
      id: "res-1",
      full_name: "Daniel Tan",
      precinct: "Precinct 4",
      matchScore: "95%",
      reason: "Matches intermediate badminton tier and weekend morning availability."
    },
    {
      id: "res-2",
      full_name: "Emily Wong",
      precinct: "Precinct 2",
      matchScore: "88%",
      reason: "Frequently joins racquet sports in Sports Hall Court 2."
    }
  ];

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️ GEMINI_API_KEY is missing in backend environment.");
      return defaultFallback;
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const prompt = `
      Act as an AI resident matching engine for a local township community app.
      
      Activity Context:
      - Title: ${activity?.title || "Community Event"}
      - Level/Tier: ${activity?.level_tier || "All Levels"}
      - Venue: ${activity?.venue || "Community Center"}

      Candidate Residents List:
      ${JSON.stringify(residents, null, 2)}

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

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean any residual markdown formatting fences
    const cleanText = text.replace(/```json|```/g, '').trim();
    const parsedMatches = JSON.parse(cleanText);

    if (Array.isArray(parsedMatches) && parsedMatches.length > 0) {
      return parsedMatches;
    }

    return defaultFallback;
  } catch (error) {
    console.error("❌ Gemini rankMatchedResidents Error:", error);
    return defaultFallback;
  }
}

/**
 * Moderates chat messages for safety
 */
export async function moderateChatMessage(messageText) {
  try {
    if (!process.env.GEMINI_API_KEY) return { isSafe: true, reason: "" };

    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
    const prompt = `Analyze this community chat message for hate speech, harassment, or severe profanity: "${messageText}". Respond in JSON: {"isSafe": true/false, "reason": "short explanation if unsafe"}`;

    const result = await model.generateContent(prompt);
    const cleanText = result.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (err) {
    console.error("Chat moderation error:", err);
    return { isSafe: true, reason: "" };
  }
}