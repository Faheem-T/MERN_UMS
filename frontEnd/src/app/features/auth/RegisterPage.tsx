import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, userSchema } from "../../ZodSchemas/userSchema";
import { useRegisterUserMutation } from "../api/authApi";
import { useNavigate } from "react-router-dom";
export const RegisterPage = () => {
  const navigate = useNavigate();
  // react form hook variables
  const form = useForm<User>({ resolver: zodResolver(userSchema) });
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  // redux api hook to register user
  const [createRegisterUserMutation, { isLoading }] = useRegisterUserMutation();

  // form submit handler
  const onSubmit = async (formData: User) => {
    const { data, error } = await createRegisterUserMutation({ ...formData });
    if (error) return console.log(error);
    console.log(data);
    return navigate("/login");
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-2">
      <div className="text-5xl font-black">Register!</div>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 flex flex-col gap-3 [&>*]:p-2 [&>*]:rounded-xl text-2xl text-bg"
        // [&>*] is used to style all children
      >
        <input {...register("username")} placeholder="Username" />
        <input
          {...register("password")}
          placeholder="Password"
          type="password"
        />
        <input {...register("email")} placeholder="Email" />
        <button
          className="bg-primary text-textColor hover:bg-red-900 disabled:bg-red-300 disabled:hover:bg-red-300"
          disabled={isLoading}
        >
          {isLoading ? "Loading" : "Submit"}
        </button>
        <div className="text-red-700 text-sm text-center">
          <div>{errors.username?.message}</div>
          <div>{errors.password?.message}</div>
          <div>{errors.email?.message}</div>
        </div>

        <DevTool control={control} />
      </form>
    </div>
  );
};
