import { useState } from "react";
import { createPortal } from "react-dom";
import { useUploadPfpMutation } from "../features/api/pfpUploadApi";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { useAppSelector } from "../hooks";
import { selectUserId } from "../features/auth/authSlice";

interface ImageUploadModalProps {
  open: boolean;
}

interface UploadImageFormFields extends HTMLFormControlsCollection {
  image: HTMLInputElement;
}

interface UploadImageForm extends HTMLFormElement {
  readonly elements: UploadImageFormFields;
}

export const ImageUploadModal = ({ open }: ImageUploadModalProps) => {
  const modalRoot = document.getElementById("modalRoot");
  const [imgSrc, setImgSrc] = useState<null | string>(null);
  const [createUploadPfpMutation] = useUploadPfpMutation();
  // current user's ID
  const userId = useAppSelector(selectUserId);

  // shows image preview on image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    if (e.target.files) {
      setImgSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  if (!open || !userId) return null;

  const handleSubmit = async (e: React.FormEvent<UploadImageForm>) => {
    e.preventDefault();
    const { elements } = e.currentTarget;
    if (!elements.image?.files) return console.log("hell no");
    const imgFile = elements.image?.files[0];
    const formData = new FormData();
    formData.append("file", imgFile);
    formData.append("upload_preset", "pfpUpload");
    const url = await uploadToCloudinary(formData);
    console.log(url);
    createUploadPfpMutation({ pfpUrl: url, userId });
  };
  if (!modalRoot) {
    return <div>Modal Root not Found</div>;
  }
  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col items-center justify-center"
      onClick={() => {
        console.log("Modal Clicked!");
      }}
    >
      <form
        className="w-1/2 h-1/2 bg-white flex flex-col items-center justify-center gap-3 rounded-lg"
        onClick={(e) => {
          // stopping propagation which clicked on modal main body
          // so that it isn't closed
          e.stopPropagation();
        }}
        onSubmit={handleSubmit}
      >
        <div className="rounded-full overflow-hidden h-40 w-40 flex items-center justify-center border border-black">
          <img
            src={imgSrc ? imgSrc : "userIcon.jpg"}
            className="w-full border"
          />
        </div>
        <input
          name="image"
          type="file"
          onChange={handleImageUpload}
          className="file:rounded-md"
        />
        <button className="p-2 border bg-primary text-white font-bold">
          Submit
        </button>
      </form>
    </div>,
    modalRoot
  );
};
