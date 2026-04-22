const { getAiSummary } = require('../services/aiService');

exports.processNotes = async (req, res) => {
    try {
        const { text } = req.body;
        
        // Agar kisine khali request bhej di toh error return karo
        if (!text) {
            return res.status(400).json({ error: 'Text input is required' });
        }

        // Service ko call karke AI se result mangwao
        const aiResponse = await getAiSummary(text);
        
        // Frontend ko result bhej do
        res.json(aiResponse);
    } catch (error) {
        console.error("Controller Error: - summarizeController.js:18", error);
        res.status(500).json({ error: 'Failed to process notes.' });
    }
};