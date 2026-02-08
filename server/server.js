const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Set API Key from Runtime Environment (Standard for Gemini deployment)
const apiKey = ""; 
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Exponential Backoff implementation for AI resilience
 */
const callGemini = async (prompt, retries = 5, delay = 1000) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        if (retries > 0) {
            await new Promise(res => setTimeout(res, delay));
            return callGemini(prompt, retries - 1, delay * 2);
        }
        throw err;
    }
};

/**
 * AI Chat Endpoint
 */
app.post('/api/chat', async (req, res) => {
    const { message, lang } = req.body;
    try {
        const systemPrompt = `
            You are Margadarshak AI, an expert agricultural consultant for the state of Jharkhand, India. 
            Farmers are interacting with you via voice and text. 
            Keep your responses very brief (max 3 sentences) and action-oriented. 
            Focus on Jharkhand specific crops: Rice, Maize, Pulses.
            Language: ${lang === 'hi' ? 'Simple Hindi' : 'Simple English'}.
            Do not use markdown formatting like bold/italics, just plain text.
        `;
        
        const response = await callGemini(systemPrompt + "\nFarmer says: " + message);
        res.json({ reply: response });
    } catch (err) {
        res.status(500).json({ reply: "Connection issues. Please try again later." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Margadarshak AI Server live on http://localhost:${PORT}`));