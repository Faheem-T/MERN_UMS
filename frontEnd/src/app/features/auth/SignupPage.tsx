import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, userSchema } from "../../ZodSchemas/userSchema";
export const SignupPage = () => {
  const form = useForm<User>({ resolver: zodResolver(userSchema) });

  const { register, control, handleSubmit, formState } = form;

  const { errors } = formState;

  const onSubmit = async () => {};

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-2">
      <div className="text-5xl font-black">Sign Up!</div>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 flex flex-col gap-3 [&>*]:p-2 [&>*]:rounded-xl text-2xl text-bg"
        // [&>*] is used to style all children
      >
        <input {...register("username")} placeholder="Username" />
        <input {...register("password")} placeholder="Password" />
        <input {...register("email")} placeholder="Email" />
        <button className="bg-primary text-textColor hover:bg-red-900 disabled:bg-red-300 disabled:hover:bg-red-300">
          Submit
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
