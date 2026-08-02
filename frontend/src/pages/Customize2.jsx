import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function Customize2() {
  const { userData, BackendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);

  const [assistantName, setAssistantName] = useState(
    userData?.AssistantName || ""
  );

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      let formData = new FormData();

      formData.append("assistantName", assistantName);

      if (BackendImage) {
        formData.append("assistantImage", BackendImage);
      }
      //check this once
      else {
        formData.append("imageUrl", selectedImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );

      setLoading(false);

      console.log(result.data);

      setUserData(result.data);

      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className=" w-full h-[100vh] bg-gradient-to-t from-[black] to-[#530a03] flex justify-center items-center flex-col p-[20px] relative">
      <MdKeyboardBackspace
        className="absolute top-[30px] left-[30px] cursor-pointer text-white w-[25px] h-[25px] "
        onClick={() => navigate("/customize")}
      />

      <h1
        className="text-white mb-[30px] text-[30px] text-center
      "
      >
        Enter Your <span className="text-red-200">Assistant Name </span>
      </h1>

      <input
        type="text"
        placeholder="eg.Sophia"
        className="w-full h-[40px] max-w-[600px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />

      {assistantName && (
        <button
          className="min-w-[300px] h-[60px] m bg-white rounded-full text-black font-semibold text-20px mt-[30px]"
          disabled={loading}
          onClick={() => {
            handleUpdateAssistant();
          }}
        >
          {!loading ? "Finally Create Your Assistant" : "Loading...."}
        </button>
      )}
    </div>
  );
}

export default Customize2;