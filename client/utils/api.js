export async function fetchAIResponse(text) {
    const API_URL = 'http://localhost:5000/api/summarize';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Server error');
        }

        return data;

    } catch (error) {
        console.error("API Error: - api.js:22", error);
        throw error;
    }
}