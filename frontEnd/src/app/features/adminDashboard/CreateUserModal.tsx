import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { EditUser, User, userSchema } from "../../ZodSchemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUserMutation } from "../api/usersApi";
import React from "react";

interface createUserModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateUserModal = ({
  isOpen,
  setIsOpen,
}: createUserModalProps) => {
  const modalRoot = document.getElementById("modalRoot");
  const [createCreateUserMutation, { isLoading, isSuccess }] =
    useCreateUserMutation();

  const { register, handleSubmit, formState } = useForm<User>({
    resolver: zodResolver(userSchema),
  });
  const { errors } = formState;

  if (!isOpen) {
    return null;
  }

  if (!modalRoot) {
    return <div>Modal Root not Found</div>;
  }

  const onSubmit = async (formData: EditUser) => {
    await createCreateUserMutation({
      newUser: { ...formData },
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
        <div className="font-bold text-2xl text-black">CREATE USER</div>
        <input placeholder="username" {...register("username")} />
        <input placeholder="email" {...register("email")} />
        <input
          placeholder="password"
          {...register("password")}
          type="password"
        />

        <button className="p-2 border bg-primary text-white font-bold">
          {isLoading ? "Loading..." : isSuccess ? "User created!" : "Submit"}
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
