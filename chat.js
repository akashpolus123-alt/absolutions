exports.handler = async (event) => {
  // Sirf POST requests allow karein
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: "Method Not Allowed"
      })
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      reply: "✅ Backend is working successfully!"
    })
  };
};