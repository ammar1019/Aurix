import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadonCloudinary = async (filePath) => {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_NAME,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    // Upload an image
    //uploadResult will have a URL that is returned
    const uploadResult = await cloudinary.uploader.upload(filePath);

    //synchronously it unlinks the path provided, here its the image that will be deleted
    fs.unlinkSync(filePath);
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error); //  added to log error

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // safely delete only if file exists
    }

    return null; // fixed: safely return null if error occurs
  }
};

export default uploadonCloudinary;