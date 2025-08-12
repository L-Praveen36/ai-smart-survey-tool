// backend/index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
// Optional: restrict CORS in production
// app.use(cors({ origin: ["https://ai-smart-survey-tool-mu.vercel.app"] }));
ap.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Smart Survey Backend Running ✅');
});

// Health check endpoint for Render
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.post('/api/survey', async (req, res) => {
  const { topic, language = "en", voice_enabled = false, adaptive_enabled = true } = req.body;

  try {
    // INSTRUCT LLM TO GENERATE QUESTIONS WITH FULL FEATURE FIELDS
    const prompt = `
      Generate 5 survey questions on the topic "${topic}" in ${language}.
      Each question should be a JSON object with these keys:
      - "text": the question text
      - "type": one of ["text", "radio", "checkbox"]
      - "options": array, only for radio/checkbox
      - "language": "${language}"
      - "ai_generated": true
      - "voice_enabled": ${voice_enabled}
      - "adaptive_enabled": ${adaptive_enabled}
      - "audio_metadata": {} (leave empty for now)
      - "adaptive_config": {} (leave empty for now)
      Example:
      [
        {"text": "...", "type": "text", "language": "${language}", "ai_generated": true, ...}
      ]
      Only output the array, nothing else.
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    // Try to parse LLM output as JSON (with fallback)
    let questions = [];
    try {
      questions = JSON.parse(response.choices[0].message.content);
    } catch (e) {
      // fallback: split by lines and wrap with feature fields
      questions = response.choices[0].message.content
        .trim()
        .split('\n')
        .filter(q => q.trim() !== '')
        .map((text, idx) => ({
          text: text.replace(/^\d+\.\s*/, ''),
          type: 'text',
          language: language,
          ai_generated: true,
          voice_enabled,
          audio_metadata: {},
          adaptive_enabled,
          adaptive_config: {},
          options: []
        }));
    }

    // Ensure all extra feature fields are present for every question
    questions = questions.map(q => ({
      text: q.text,
      type: q.type || 'text',
      options: Array.isArray(q.options) ? q.options : [],
      language: q.language || language,
      ai_generated: true,
      voice_enabled: typeof q.voice_enabled === 'boolean' ? q.voice_enabled : voice_enabled,
      audio_metadata: q.audio_metadata || {},
      adaptive_enabled: typeof q.adaptive_enabled === 'boolean' ? q.adaptive_enabled : adaptive_enabled,
      adaptive_config: q.adaptive_config || {}
    }));

    res.json({ questions });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Survey generation failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
