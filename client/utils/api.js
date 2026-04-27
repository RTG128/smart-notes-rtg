export async function fetchAIResponse(text) {
    const API_URL = "https://rtg-smart-notes-backend.onrender.com/api/summarize";

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000); // 60 sec wait

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Server error');
        }

        return data;

    } catch (error) {
        console.error("API Error: - api.js:28", error);
        throw error;
    }
}