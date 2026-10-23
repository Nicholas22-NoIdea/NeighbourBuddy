// 1. Fetch activities
export async function getActivities() {
  try {
    const res = await fetch('/api/activities');
    if (!res.ok) throw new Error('Failed to fetch activities');
    const data = await res.json();
    return data.activities;
  } catch (error) {
    console.error('getActivities error:', error);
    return [];
  }
}

// 2. Trigger AI matching
export async function getAIMatches(activityId: string) {
  try {
    const res = await fetch('/api/ai/match-buddies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityId }),
    });

    if (!res.ok) throw new Error('Failed to get AI matches');
    return await res.json();
  } catch (error) {
    console.error('getAIMatches error:', error);
    return null;
  }
}

// 3. Send a moderated group chat message
export async function sendChatMessage(activityId: string, senderId: string, messageText: string) {
  try {
    const res = await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityId, senderId, messageText }),
    });
    return await res.json();
  } catch (error) {
    console.error('sendChatMessage error:', error);
    return { error: 'Network error sending message' };
  }
}

// 4. Register for activity
export async function registerForActivity(activityId: string) {
  try {
    const res = await fetch(`/api/activities/${activityId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to register for activity');
    return await res.json();
  } catch (error) {
    console.error('registerForActivity error:', error);
    return null;
  }
}