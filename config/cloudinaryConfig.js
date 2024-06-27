import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dy0sflvdv",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadImage = async (file) => {
  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          use_filename: true,
          folder: "Blog post images",
          unique_filename: false,
          overwrite: true,
          public_id: file.originalname.split(".")[0],
        },
        (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });
    console.log(uploadResult);
    const uploadObject = {
      url: uploadResult.secure_url,
      name: uploadResult.display_name,
    };
    return uploadObject;
  } catch (error) {
    console.error("Error uploading image", error);
    throw new Error("Problem uploading image");
  }
};
export default uploadImage;
