import axios from "axios";
export const uploadToCloudinary = async (file: FormData): Promise<string> => {
  const url = await axios
    .post("https://api.cloudinary.com/v1_1/dlicxnblg/image/upload", file)
    .then((response) => response.data["secure_url"])
    .catch((err) => console.log(err));
  return url;
};
