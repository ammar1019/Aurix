import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "./context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "./assets/ai.gif";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import userImg from "./assets/user.gif";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setHam] = useState(false);
  const [micStatus, setMicStatus] = useState("Click Assistant Image to enable Mic");

  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const isProcessingRef = useRef(false);
  const hasGreetedRef = useRef(false);
  const synth = window.speechSynthesis;

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/sigin");
    } catch (error) {
      console.log(error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }
  };

  const startListening = () => {
    if (
      isSpeakingRef.current ||
      isProcessingRef.current ||
      !recognitionRef.current
    ) {
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (err) {
      if (err.name !== "InvalidStateError") {
        console.error(err);
      }
    }
  };

  const speak = (text) => {
    if (!text) return;

    stopListening();
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";

    const voices = synth.getVoices();
    const hindiVoice = voices.find(
      (v) => v.lang === "hi-IN" || v.lang.startsWith("hi")
    );
    if (hindiVoice) utterance.voice = hindiVoice;

    isSpeakingRef.current = true;
    setMicStatus("Assistant speaking...");

    const finishSpeaking = () => {
      isSpeakingRef.current = false;
      isProcessingRef.current = false;
      setAiText("");
      setMicStatus("Listening...");
      setTimeout(() => startListening(), 800);
    };

    utterance.onend = finishSpeaking;
    utterance.onerror = finishSpeaking;

    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    const openURL = (url) => window.open(url, "_blank");
    const query = encodeURIComponent(userInput || "");

    switch (type) {
      case "google_search":
        openURL(`https://www.google.com/search?q=${query}`);
        break;
      case "calculator_open":
        openURL(`https://www.google.com/search?q=calculator`);
        break;
      case "instagram_open":
        openURL(`https://www.instagram.com/`);
        break;
      case "facebook_open":
        openURL(`https://www.facebook.com/`);
        break;
      case "linkedin_open":
        openURL(`https://www.linkedin.com/search?q=${query}`);
        break;
      case "youtube_search":
      case "youtube_play":
        openURL(`https://www.youtube.com/results?search_query=${query}`);
        break;
      case "weather-show":
        openURL(`https://www.google.com/search?q=weather`);
        break;
      default:
        break;
    }
  };

  const processUserQuery = async (query) => {
    const trimmed = query.trim();
    if (
      !trimmed ||
      trimmed.length < 2 ||
      isProcessingRef.current ||
      isSpeakingRef.current
    ) {
      return;
    }

    isProcessingRef.current = true;
    stopListening();
    setUserText(trimmed);
    setMicStatus("Thinking...");

    try {
      const data = await getGeminiResponse(trimmed);
      if (data?.response) {
        setAiText(data.response);
        handleCommand(data);
      } else {
        speak("Sorry, I didn't understand that.");
      }
    } catch (err) {
      console.error(err);
      speak("Sorry, something went wrong.");
    } finally {
      setUserText("");
    }
  };

  const requestMicPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStatus("Mic enabled. Listening...");
      startListening();
    } catch (err) {
      console.error(err);
      setMicStatus("Microphone access denied!");
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicStatus("Speech Recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setListening(true);
      setMicStatus("Listening...");
    };

    recognition.onresult = (e) => {
      if (isSpeakingRef.current || isProcessingRef.current) return;

      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }

      setUserText(transcript);

      if (e.results[e.results.length - 1].isFinal) {
        processUserQuery(transcript);
      }
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      if (!isSpeakingRef.current && !isProcessingRef.current) {
        setTimeout(() => startListening(), 400);
      }
    };

    requestMicPermission();

    return () => {
      synth.cancel();
      try {
        recognition.abort();
      } catch (e) {}
    };
  }, []);

  useEffect(() => {
    if (userData?.name && !hasGreetedRef.current) {
      hasGreetedRef.current = true;
      speak(`Hello ${userData.name}, how can I help you?`);
    }
  }, [userData]);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#3d0802] flex justify-center items-center flex-col gap-[15px]">
      <CgMenuRight
        className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer"
        onClick={() => setHam(true)}
      />

      <div
        className={`absolute top-0 lg:hidden right-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start transition-all duration-300 transform ${
          ham ? "translate-x-0" : "translate-x-full transition-transform"
        }`}
      >
        <RxCross1
          className=" text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer"
          onClick={() => setHam(false)}
        />

        <button
          className="min-w-[150px] h-[60px] bg-white rounded-full cursor-pointer text-black font-semibold mt-[30px]"
          onClick={handleLogOut}
        >
          Log Out
        </button>

        <button
          className="min-w-[150px] h-[60px] bg-white rounded-full cursor-pointer text-black font-semibold text-[19px] px-[20px] py-[10px]"
          onClick={() => navigate("/customize")}
        >
          Customize Your Assistant
        </button>

        <div className="w-full h-[2px] bg-gray-400"></div>

        <h1 className="text-white font-semibold text-[19px]">History</h1>

        <div className="w-full h-[60%] overflow-y-auto flex flex-col gap-y-5 pr-2">
          {userData?.history?.map((his, index) => (
            <span key={index} className="text-gray-200 text-[18px] truncate">
              {his}
            </span>
          ))}
        </div>
      </div>

      <button
        className="min-w-[150px] h-[40px] bg-white rounded-full cursor-pointer text-black font-semibold absolute hidden lg:block top-[20px] right-[20px]"
        onClick={handleLogOut}
      >
        Log Out
      </button>

      <button
        className="min-w-[150px] h-[40px] bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-black font-semibold text-[19px] px-[20px] py-[10px] hidden lg:block"
        onClick={() => navigate("/customize")}
      >
        Customize Your Assistant
      </button>

      <div
        className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg cursor-pointer border-2 border-red-500/20 hover:border-red-500 transition-all"
        onClick={requestMicPermission}
        title="Click to start microphone"
      >
        <img
          src={userData?.assistantImage}
          alt=""
          className="h-full object-cover"
        />
      </div>

      <h1 className="text-white text-[18px] font-semibold">
        I'm {userData?.assistantName || "your Assistant"}
      </h1>

      <div className="flex items-center gap-2">
        <span
          className={`w-3 h-3 rounded-full ${
            listening ? "bg-green-500 animate-pulse" : "bg-red-500"
          }`}
        ></span>
        <p className="text-xs text-gray-300 font-mono">{micStatus}</p>
      </div>

      {!aiText && <img src={userImg} alt="" className="w-[200px]" />}
      {aiText && <img src={aiImg} alt="" className="w-[200px]" />}

      <h1 className="text-white text-[18px] font-semibold text-wrap px-4 text-center min-h-[40px]">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
}

export default Home;