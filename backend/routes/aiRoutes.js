const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/analyze', async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description required' });
  }

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    let aiResponse = {
      priority: "Medium",
      department: "General Admin",
      summary: "A user reported an issue: " + title,
      autoResponse: "Thank you for your complaint. We are looking into this issue."
    };

    let useFallback = true;

    if (apiKey) {
      const prompt = `Analyze this complaint: Title: "${title}", Description: "${description}". 
      Return ONLY a JSON object with these exact keys: 
      "priority" (Low/Medium/High/Critical), 
      "department" (suggested department), 
      "summary" (1 sentence summary), 
      "autoResponse" (polite response to user).`;

      try {
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "google/gemini-2.0-flash-exp:free", // Using a free model to avoid 402 Payment Required errors
            messages: [{ role: "user", content: prompt }]
          },
          {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            }
          }
        );
        
        const textResponse = response.data.choices[0].message.content;
        const jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);
        aiResponse = { ...aiResponse, ...parsed };
        useFallback = false; // API succeeded
      } catch (apiErr) {
        console.error("OpenRouter API Error (Falling back to local AI):", apiErr.message);
        // Fallthrough to local logic
      }
    }

    if (useFallback) {
      // Advanced Mock logic based on NLP keywords
      const text = `${title} ${description}`.toLowerCase();
      
      const keywords = {
        'Water Supply': ['water', 'leak', 'pipe', 'plumbing', 'drain', 'sewage'],
        'Electricity': ['electricity', 'power', 'wire', 'spark', 'current', 'outage', 'blackout'],
        'Sanitation': ['garbage', 'waste', 'trash', 'smell', 'clean', 'dump', 'dustbin'],
        'Roads': ['road', 'pothole', 'street', 'traffic', 'broken', 'pavement']
      };

      for (const [dept, words] of Object.entries(keywords)) {
        if (words.some(w => text.includes(w))) {
          aiResponse.department = dept;
          break;
        }
      }
      
      if (text.includes('urgent') || text.includes('emergency') || text.includes('fire') || text.includes('spark') || text.includes('danger')) {
        aiResponse.priority = 'Critical';
        aiResponse.autoResponse = "URGENT: Your complaint has been flagged as critical. Emergency teams have been notified.";
      } else if (text.includes('outage') || text.includes('broken') || text.includes('leak')) {
        aiResponse.priority = 'High';
        aiResponse.autoResponse = "We have received your high-priority complaint and will assign a technician shortly.";
      } else {
        aiResponse.priority = 'Medium';
        aiResponse.autoResponse = `Thank you for reporting this to the ${aiResponse.department}. We will investigate soon.`;
      }
      
      aiResponse.summary = `Local AI detected an issue related to ${aiResponse.department} with ${aiResponse.priority} priority.`;
    }

    res.json(aiResponse);
  } catch (err) {
    console.error("Critical Server Error in AI Route:", err.message);
    res.status(500).json({ error: 'Failed to process AI request' });
  }
});

module.exports = router;
