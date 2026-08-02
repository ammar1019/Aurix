import User from "../models/user.model.js";
import geminiResponse from "../gemini.js";
import uploadonCloudinary from "../config/cloudinary.js";
import moment from "moment/moment.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(500).json({
      message: "Internal user error",
      error: error.message,
    });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;

    let assistantImage;

    if (req.file) {
      assistantImage = await uploadonCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.error("UpdateAssistant ERROR:", error);
    return res.status(400).json({
      message: "Update Assistant Error",
      error: error.message,
    });
  }
};
export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({ message: "Command is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.history) {
      user.history = [];
    }
    user.history.push(command);
    await user.save();

    const userName = user.name || "User";
    const assistantName = user.assistantName || "Assistant";

    let rawResult;
    try {
      rawResult = await geminiResponse(command, assistantName, userName);
    } catch (geminiErr) {
      // Catch rate limit (429) or other API errors gracefully
      if (geminiErr?.response?.status === 429) {
        return res.json({
          type: "general",
          userInput: command,
          response: "I am receiving too many requests right now. Please wait a minute and try again.",
        });
      }
      throw geminiErr; // rethrow other unexpected errors
    }

    const cleanedResult = rawResult.replace(/```json|```/g, "").trim();
    const jsonMatch = cleanedResult.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      return res.status(400).json({
        message: "Sorry, I can't understand",
      });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    const type = gemResult.type;

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput || command,
          response: `Current date is ${moment().format("DD-MM-YYYY")}`,
        });
      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput || command,
          response: `Current time is ${moment().format("hh:mm A")}`,
        });
      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput || command,
          response: `Today is ${moment().format("dddd")}`,
        });
      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput || command,
          response: `Today is ${moment().format("MMMM")}`,
        });
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "general":
      case "calculator_open":
      case "facebook_open":
      case "instagram_open":
      case "linkedin_open":
      case "weather-show":
        return res.json({
          type,
          userInput: gemResult.userInput || command,
          response: gemResult.response,
        });
      default:
        return res.json({
          type: "general",
          userInput: gemResult.userInput || command,
          response: gemResult.response || "How can I help you?",
        });
    }
  } catch (error) {
    console.error("askToAssistant Error:", error);
    return res.status(500).json({
      message: "Ask assistant error",
      error: error.message,
    });
  }
};