const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});
// console.log("ENV CHECK:", process.env.TOGETHER_API_KEY);
const { Together } = require("together-ai");

const client = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

async function classifyNotification(message) {
  try {
    console.log("Classifying notification:", message);

    const response = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3-8B-Instruct-Lite",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are a strict AI classifier for notifications.

Return ONLY valid JSON:

{
  "priority": "HIGH" | "MEDIUM" | "LOW",
  "isSpam": true | false,
  "confidence": number
}

-------------------------
RULES
-------------------------

PRIORITY:
- HIGH → errors, failures, security alerts, payment issues
- MEDIUM → warnings, unusual activity, performance issues
- LOW → informational messages

SPAM:
- true → promotions, ads, clickbait, rewards, suspicious offers
- false → system alerts, user actions, legitimate notifications

CONFIDENCE:
- Between 0 and 1
- High when clear, low when uncertain

-------------------------
EXAMPLES
-------------------------

Input: "Server CPU usage is 95%"
Output:
{
  "priority": "HIGH",
  "isSpam": false,
  "confidence": 0.95
}

Input: "Win a free iPhone now!!! Click here"
Output:
{
  "priority": "LOW",
  "isSpam": true,
  "confidence": 0.98
}

Input: "User logged in successfully"
Output:
{
  "priority": "LOW",
  "isSpam": false,
  "confidence": 0.85
}

-------------------------
IMPORTANT
-------------------------
Return ONLY JSON. No explanation.
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0,
    });

    const data = JSON.parse(response.choices[0].message.content);

    // ✅ Validation layer
    const VALID = ["HIGH", "MEDIUM", "LOW"];

    if (!VALID.includes(data.priority)) data.priority = "LOW";
    if (typeof data.isSpam !== "boolean") data.isSpam = false;
    if (typeof data.confidence !== "number") data.confidence = 0.5;

    console.log("LLM Output:", data);

    return data;
  } catch (err) {
    console.error("LLM Classification Error:", err);

    return fallbackClassification(message);
  }
}

/**
 * Fallback (rule-based)
 */
function fallbackClassification(message) {
  const msg = message.toLowerCase();

  let priority = "LOW";
  let isSpam = false;

  if (
    msg.includes("error") ||
    msg.includes("failed") ||
    msg.includes("urgent")
  ) {
    priority = "HIGH";
  } else if (
    msg.includes("warning") ||
    msg.includes("memory") ||
    msg.includes("disk")
  ) {
    priority = "MEDIUM";
  }

  // 🔥 spam detection fallback
  if (
    msg.includes("win") ||
    msg.includes("free") ||
    msg.includes("offer") ||
    msg.includes("click")
  ) {
    isSpam = true;
  }

  return {
    priority,
    isSpam,
    confidence: 0.5,
  };
}
module.exports = { classifyNotification };
