export async function fetchAIResponse(text) {
    // Relative path use karo, yeh CORS error ko khatam kar dega
    const API_URL = '/api/summarize';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Server se response nahi mila!');
        }

        return await response.json();
    } catch (error) {
        console.error("API Error: - api.js:21", error);
        throw error;
    }
}