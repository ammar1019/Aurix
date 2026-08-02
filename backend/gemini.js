import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl =
      process.env.GEMINI_API_URL ||
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `You are a virtual assistant named ${assistantName || "Assistant"} created by ${userName || "User"}.
You are not Google. You will now behave like a voice-enabled assistant. 
Your task is to understand the user's natural language input and respond with a JSON object like this:
{
  "type":"general" |"google_search"|"youtube_search"|"youtube_play"|"get_time"|"get_date"|"get_day"|"get_month"|"calculator_open"|"instagram_open"|"facebook_open"|"linkedin_open"|"weather-show",
  "userInput":"<original user input without assistant name>",
  "response":"<a short spoken response to read out loud to the user>"
}

Instructions:
-> "type": determine the intent of the user.
-> "userInput": original sentence the user spoke.
-> "response": A short voice-friendly reply.
-> "general": for factual questions or general conversation.
-> Use ${userName} if asked who created you.
-> Respond ONLY with valid JSON. Do not include markdown code blocks or text outside JSON.

User input: "${command}"`;

    const result = await axios.post(apiUrl, {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    const textResponse =
      result.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("Empty response received from Gemini API");
    }

    return textResponse;
  } catch (error) {
    console.error("Gemini API Error:", error?.response?.data || error.message);
    throw error;
  }
};

export default geminiResponse;