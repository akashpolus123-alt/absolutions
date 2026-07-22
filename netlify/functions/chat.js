const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const { message } = JSON.parse(event.body);
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ reply: "OpenRouter API Key Netlify میں نہیں ملی۔" })
      };
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": Bearer ${apiKey},
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const replyText =
      data.choices?.[0]?.message?.content ||
      "معذرت، بوٹ اس وقت جواب نہیں دے پا رہا۔";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: replyText })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "سرور کا مسئلہ ہے: " + error.message })
    };
  }
};
