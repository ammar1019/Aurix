import React, { useContext, useRef, useState } from "react";

import { MdKeyboardBackspace } from "react-icons/md";
import Card from "../components/Card";

import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";

import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
function Customize() {
  const {
    BackendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    serverUrl,
    userData,
    setUserData,
  } = useContext(userDataContext);

  const navigate = useNavigate();

  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    console.log("Uploaded file:", file);
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className=" w-full h-[100vh] bg-gradient-to-t from-[black] to-[#530f03] flex justify-center items-center flex-col p-[20px]">
      <h1
        className="text-white mb-[30px] text-[30px] text-center
      "
      >
        Select Your <span className="text-red-200"> Assistant Image </span>{" "}
      </h1>
      <div className=" w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px] ">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <div
          className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#200502] border-2 border-[#ff6f0066] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${
            selectedImage === "input"
              ? "border-4 border-white shadow-2xl shadow-red-950"
              : null
          }`}
          onClick={() => {
            inputImage.current.click();

            setSelectedImage("input");
          }}
        >
          {!frontendImage && (
            <RiImageAddLine className="text-white w-[25px] h-[25px]" />
          )}

          {frontendImage && (
            <img src={frontendImage} className="h-full object-cover"></img>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        ></input>
      </div>

      {selectedImage && (
        <button
          className="min-w-[150px] h-[60px] m bg-white rounded-full text-black font-semibold text-20px mt-[30px]"
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Customize;