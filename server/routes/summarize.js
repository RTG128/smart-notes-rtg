const fetch = require('node-fetch');

exports.getAiSummary = async (text) => {
    const apiKey = process.env.HUGGINGFACE_API_KEY; 
    
    // Using a more advanced model that can follow JSON formatting
    const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

    const prompt = `[INST] You are a helpful B.Tech tutor. Provide a summary of the following text in JSON format with these fields:
    {
        "summary": ["Point 1", "Point 2"],
        "englishExplanation": "Simple explanation",
        "hinglishExplanation": "Asli hinglish explanation",
        "keyPoints": [{"term": "word", "def": "definition"}],
        "realLifeExample": "Real world example"
    }
    Text: ${text} [/INST]`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ 
                inputs: prompt,
                parameters: { max_new_tokens: 500, return_full_text: false }
            }),
        });

        const result = await response.json();
        const output = result[0].generated_text;
        
        // JSON extract karna kyunki model extra text bhi de sakta hai
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: ["Error parsing AI response"] };
        
    } catch (error) {
        console.error("AI Service Error: - summarize.js:40", error);
        throw error;
    }
};