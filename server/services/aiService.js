exports.getAiSummary = async (text) => {
    // SECURITY: API key ko code mein mat likho, process.env se lo
    const apiKey = process.env.GEMINI_API_KEY; 
    
    if (!apiKey) {
        throw new Error("API Key missing! Render settings mein GEMINI_API_KEY set karo.");
    }

    const systemPrompt = `You are an expert tutor for B.Tech CSE students. 
    Analyze the provided text and return ONLY a valid JSON object with the following structure:
    {
        "summary": ["point 1", "point 2", "point 3"],
        "englishExplanation": "Simple beginner-friendly explanation.",
        "hinglishExplanation": "Friendly explanation using a mix of Hindi and English.",
        "keyPoints": [{"term": "Keyword", "def": "Definition"}],
        "realLifeExample": "One relatable real-world example."
    }`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: systemPrompt }]
                },
                contents: [{
                    parts: [{ text: text }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    response_mime_type: "application/json",
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini Error Details: - aiService.js:41", errorData);
            throw new Error('Gemini API Error');
        }
        
        const data = await response.json();
        let resultText = data.candidates[0].content.parts[0].text;
        
        return JSON.parse(resultText);
        
    } catch (error) {
        console.error("AI Service Error: - aiService.js:51", error);
        throw error;
    }
};