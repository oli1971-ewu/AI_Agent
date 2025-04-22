const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());


const HF_API_KEY = "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"; 
const HF_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-small";


// === Business Context ===
const businessContext = `
You are an AI assistant for "Super Pizza Shop".
Business Hours: 10 AM - 10 PM
Location: 123 Pizza Street
Menu:
- Pepperoni Pizza: $12
- Veggie Pizza: $10
- Coke: $2
- Garlic Bread: $4

Act like a friendly, helpful human agent. Answer questions and confirm orders.
`;

// === POST endpoint to handle AI query ===
app.post("/query", async (req, res) => {
  const userQuery = req.body.query;
  const prompt = `${businessContext}\n\nCustomer: ${userQuery}\nAgent:`;

  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: prompt
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const output = response.data[0]?.generated_text || "Sorry, I couldn't generate a response.";
    res.json({ response: output });

  } catch (err) {
    console.error("Error with Hugging Face API:", err.message);
    res.status(500).json({ error: "Failed to generate AI response." });
  }
});

// === Start the server ===
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
