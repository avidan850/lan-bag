exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, phone, message } = JSON.parse(event.body);

    // Basic validation
    if (
      typeof name !== "string" ||
      typeof phone !== "string" ||
      typeof message !== "string"
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid body. Expect {name, phone, message} strings." })
      };
    }

    const webhookUrl = "https://hook.eu2.make.com/3whu1ldxk5tjbw1o6kf9a6abi1tbhlbu";

    console.log("Sending data to webhook...");

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, message }),
    });

    const responseText = await response.text();
    console.log("Webhook response text:", responseText);

    if (!response.ok) {
      console.error("Webhook response error:", response.status, responseText);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Webhook failed" })
      };
    }

    console.log("Webhook call successful.");
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: responseText })
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An unexpected error occurred" })
    };
  }
};
