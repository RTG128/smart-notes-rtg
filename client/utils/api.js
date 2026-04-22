// Yeh function ab tumhare Live Render Backend ko call karega
export async function fetchAIResponse(text) {
    // Apne Render ka URL yahan set kar diya hai
    const API_URL = 'https://rtg-smart-notes.onrender.com/api/summarize';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) {
            // Agar backend se error aaye toh details ke saath throw karega
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Backend server response error');
        }

        return await response.json();
    } catch (error) {
        console.error("API Error: - api.js:23", error);
        // Error ko wapas script.js mein bhej rahe hain taaki user ko alert dikha sakein
        throw error;
    }
}