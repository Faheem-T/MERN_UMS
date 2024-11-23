import { createPortal } from "react-dom";
import { UserType } from "../../utils/types";
import { useForm } from "react-hook-form";
import { EditUser, editUserSchema } from "../../ZodSchemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateUserMutation } from "../api/usersApi";
import React from "react";

interface UpdateUserModalProps {
  isOpen: boolean;
  user: UserType | null;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UpdateUserModal = ({
  isOpen,
  setIsOpen,
  user,
}: UpdateUserModalProps) => {
  const modalRoot = document.getElementById("modalRoot");
  const [createUpdateUserMutation, { isLoading, isSuccess }] =
    useUpdateUserMutation();

  const { control, register, handleSubmit, formState, setValue } =
    useForm<EditUser>({
      resolver: zodResolver(editUserSchema),
    });
  const { errors } = formState;

  if (!isOpen || !user) {
    return null;
  }

  setValue("email", user?.email);
  setValue("username", user?.username);

  if (!modalRoot) {
    return <div>Modal Root not Found</div>;
  }

  const onSubmit = async (formData: EditUser) => {
    await createUpdateUserMutation({
      userId: user.id,
      updateUser: { ...formData },
    });
    setIsOpen(false);
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col items-center justify-center">
      <form
        className="w-1/2 h-1/2 bg-white flex flex-col items-center justify-center gap-3 rounded-lg"
        noValidate
        onClick={(e) => {
          // stopping propagation which clicked on modal main body
          // so that it isn't closed
          e.stopPropagation();
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="rounded-full overflow-hidden h-40 w-40 flex items-center justify-center border border-black">
          <img src={user.pfpUrl || "userIcon.jpg"} className="w-full border" />
        </div>
        <input {...register("email")}></input>
        <input {...register("username")}></input>

        <button className="p-2 border bg-primary text-white font-bold">
          {isLoading ? "Loading..." : isSuccess ? "User updated!" : "Submit"}
        </button>

        <div className="text-red-600">
          {errors.email?.message}
          <br />
          {errors.username?.message}
        </div>
      </form>
    </div>,
    modalRoot
  );
};
