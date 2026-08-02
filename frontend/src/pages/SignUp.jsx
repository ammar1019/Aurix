import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import iron_man from "../assets/iron_man.jpeg";
import { FaRegEye } from "react-icons/fa";
import { IoEyeOffOutline, IoLogoFacebook } from "react-icons/io5";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
const SignUp = () => {
  //state for password showing or no
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, userData, setUserData } = useContext(userDataContext); //Get the server url using context hook
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const handleSignup = async (e) => {
    e.preventDefault(); //Make sure the page doesn't reload and data is not lost
    setErr("");
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );
      // console.log(result);

      setUserData(result.data);
      setLoading(false);
      navigate("/customize");
    } catch (error) {
      console.log(error);
      setUserData(null);
      setErr(error.response.data.message);
      setLoading(false);
    }
  };
  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${iron_man})` }}
    >
      <form
        className="w-[90%] h-[500px] max-w-[400px] bg-[#00000064] backdrop-blur shadow-lg shadow-red-950 flex flex-col items-center justify-center gap-[20px] px-[20px]"
        onSubmit={handleSignup}
      >
        <h1 className="text-white text-[25px] font-semibold mb-[30px]">
          Register to <span className="text-red-500">Virtual Assistant</span>
        </h1>
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full h-[40px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full h-[40px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <div className="w-full h-[40px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full outline-none bg-transparent   px-[20px] py-[10px] rounded-full text-[18px]"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!showPassword && (
            <FaRegEye
              className="absolute top-[10px] right-[20px] text-[white] cursor-pointer"
              onClick={() => {
                setShowPassword(true);
              }}
            />
          )}
          {showPassword && (
            <IoEyeOffOutline
              className="absolute top-[10px] right-[20px] text-[white] cursor-pointer"
              onClick={() => {
                setShowPassword(false);
              }}
            />
          )}
        </div>
        {err.length > 0 && <p className="text-red-500 text-[18px]">*{err}</p>}
        <button
          className="min-w-[150px] h-[40px] bg-white rounded-full text-black font-semibold text-20px mt-[30px]"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <p
          className="text-[white] text-[18px] cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Already have an account ?{" "}
          <span className="text-red-500 ">Sign In</span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;