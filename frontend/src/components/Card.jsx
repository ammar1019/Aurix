import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext"; // Required import if not already there

function Card({ image }) {
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

  return (
    <div
      className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#200802] border-2 border-[#ff000066] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-red-950 cursor-pointer hover:border-4 hover:border-white ${
        selectedImage === image
          ? "border-4 border-white shadow-2xl shadow-red-950"
          : null
      }`}
      onClick={() => {
        setSelectedImage(image);

        // If the user selects one of the preloaded (default) images,
        // we don't need to keep any uploaded custom image in memory.
        // So we clear both BackendImage (file) and frontendImage (URL preview).

        setBackendImage(null);
        setFrontendImage(null);
      }}
    >
      <img src={image} className="h-full   object-cover " />
    </div>
  );
}

export default Card;