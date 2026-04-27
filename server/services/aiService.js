const fetch = require("node-fetch");

exports.getAiSummary = async (text) => {
    const apiKey = process.env.OPENROUTER_API_KEY;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5000",
                "X-Title": "Smart Notes"
            },
            body: JSON.stringify({
                model: "openrouter/auto",
                temperature: 0.5,
                max_tokens: 300,
                messages: [
                    {
                        role: "system",
                        content: "Return ONLY pure JSON. No markdown. No ```json."
                    },
                    {
                        role: "user",
                        content: `Give output ONLY in JSON format:

{
  "summary": ["2-4 points"],
  "explanation": "simple english",
  "hinglish": "hinglish explanation",
  "keyPoints": ["2-4 points"],
  "example": "short example"
}

Text: ${text.substring(0, 1000)}`
                    }
                ]
            })
        });

        const data = await response.json();

        let output = data.choices?.[0]?.message?.content || "";

        console.log("RAW OUTPUT: - aiService.js:46", output);

        // 🔥 REMOVE ```json and ```
        output = output.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsed;

        try {
            parsed = JSON.parse(output);
        } catch {
            console.log("⚠️ JSON direct parse failed, trying extract... - aiService.js:56");

            const match = output.match(/\{[\s\S]*\}/);

            if (match) {
                parsed = JSON.parse(match[0]);
            } else {
                throw new Error("Still not JSON");
            }
        }

        return {
            summary: parsed.summary || ["No summary"],
            explanation: parsed.explanation || "No explanation",

            // 🔥 Hinglish fallback FIX
            hinglish:
                parsed.hinglish ||
                "Simple me: " + (parsed.explanation || "Samajh nahi aaya 😅"),

            keyPoints: parsed.keyPoints || [],
            example: parsed.example || "No example"
        };

    } catch (error) {
        console.error("AI ERROR: - aiService.js:81", error.message);

        return {
            summary: ["AI error"],
            explanation: "Try again",
            hinglish: "Dobara try karo 😅",
            keyPoints: [],
            example: ""
        };
    }
};