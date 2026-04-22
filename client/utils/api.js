// Yeh function humare Node.js backend ko call karega
export async function fetchAIResponse(text) {
    try {
        const response = await fetch('http://localhost:3000/api/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) throw new Error('Backend se connect nahi ho paya');
        return await response.json();
    } catch (error) {
        console.error("API Error: - api.js:13", error);
        throw error;
    }
}