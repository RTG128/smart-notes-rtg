exports.getAiSummary = async (text) => {
    // Ab hum Gemini API Key use kar rahe hain
    const apiKey = 'AIzaSyB92ajraD20kEH_4iW2tzp0nP4hAbD9b9E';
    
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
        // Gemini API ka URL aur logic
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
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
                    response_mime_type: "application/json", // Yeh Gemini ko strictly JSON dene par majboor karega
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini Error Details: - aiService.js:38", errorData);
            throw new Error('Gemini API Error');
        }
        
        const data = await response.json();
        
        // Gemini ke response se text nikalna
        let resultText = data.candidates[0].content.parts[0].text;
        
        // Usko wapas JS Object mein convert karna
        return JSON.parse(resultText);
        
    } catch (error) {
        console.error("AI Service Error: - aiService.js:51", error);
        throw error;
    }
};