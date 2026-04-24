exports.getAiSummary = async (text) => {
    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: `Give response in JSON:
{
"summary": ["point1","point2"],
"explanation": "simple english explanation",
"hinglish": "hinglish explanation",
"keyPoints": ["point1","point2"],
"example": "real life example"
}

Text: ${text}`
                    }
                ]
            })
        });

        const data = await res.json();
        const output = data?.choices?.[0]?.message?.content || "";

        let parsed;

        try {
            const match = output.match(/\{[\s\S]*\}/);
            parsed = match ? JSON.parse(match[0]) : {};
        } catch {
            parsed = {};
        }

        return {
            summary: parsed.summary || ["Summary not available"],
            explanation: parsed.explanation || "Explanation not generated",
            hinglish: parsed.hinglish || "Hinglish not generated",
            keyPoints: parsed.keyPoints || ["No key points"],
            example: parsed.example || "No example available"
        };

    } catch (err) {
        console.error(err);

        return {
            summary: ["Error"],
            explanation: "Try again",
            hinglish: "Dobara try karo 😄",
            keyPoints: [],
            example: "No example"
        };
    }
};