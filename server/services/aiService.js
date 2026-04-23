exports.getAiSummary = async (text) => {
    // Yahan koi key hardcoded nahi hai, ye safe hai!
    const apiKey = process.env.GEMINI_API_KEY; 
    
    if (!apiKey) {
        throw new Error("API Key nahi mili! Render settings check karo.");
    }

    const systemPrompt = `You are an expert tutor for B.Tech CSE students. 
    Analyze the provided text and return ONLY a valid JSON object.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: text }] }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });

        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        return JSON.parse(data.candidates[0].content.parts[0].text);
    } catch (error) {
        console.error("AI Error: - aiService.js:27", error);
        throw error;
    }
};