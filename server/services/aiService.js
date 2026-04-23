exports.getAiSummary = async (text) => {
    // SECURITY: Hugging Face API key from environment
    const apiKey = process.env.HUGGINGFACE_API_KEY; 
    
    if (!apiKey) {
        throw new Error("API Key nahi mili! Render settings check karo.");
    }

    // Hugging Face model endpoint
    const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ 
                inputs: text,
                parameters: { max_length: 150 } 
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Hugging Face API Error: - aiService.js:27", errorData);
            throw new Error('API request failed');
        }
        
        const result = await response.json();
        
        // Hugging Face ka response structure
        return { 
            summary: [result[0]?.summary_text || "Summary generate nahi ho payi."] 
        };
        
    } catch (error) {
        console.error("AI Service Error: - aiService.js:39", error);
        throw error;
    }
};