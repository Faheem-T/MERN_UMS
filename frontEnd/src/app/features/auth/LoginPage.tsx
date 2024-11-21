import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUser, loginUserSchema } from "../../ZodSchemas/userSchema";
import { useNavigate } from "react-router-dom";
import { AuthData, useLoginUserMutation } from "../api/usersApi";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectUser, userLoggedIn } from "./authSlice";

export const LoginPage = () => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      console.log("Found user, navigatiing to home");
      navigate("/");
    }
  }, [user, navigate]);

  // react form hook variables
  const form = useForm<LoginUser>({ resolver: zodResolver(loginUserSchema) });
  const { register, control, handleSubmit, formState, setError } = form;
  const { errors } = formState;

  // login hook
  const [createLoginUserMutation, { isLoading }] = useLoginUserMutation();

  // form submit handler
  const onSubmit = async (formData: LoginUser) => {
    const { data, error }: { data?: AuthData; error?: Error | unknown } =
      await createLoginUserMutation(formData);
    if (error) {
      console.log(error);
      const { message } = error.data;
      setError("root.serverError", { message });
      return;
    } else if (!data) {
      console.log("No Data");
    } else {
      console.log("-------- Login submitted data! ---------");
      console.log(data);
      const { user, accessToken } = data.data;
      dispatch(userLoggedIn({ user, accessToken }));
      navigate("/");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-2">
      <div className="text-5xl font-black">Login!</div>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 flex flex-col gap-3 [&>*]:p-2 [&>*]:rounded-xl text-2xl text-bg"
        // [&>*] is used to style all children
      >
        <input {...register("identifier")} placeholder="Username or Email" />
        <input
          {...register("password")}
          placeholder="Password"
          type="password"
        />
        <button
          className="bg-primary text-textColor hover:bg-red-900 disabled:bg-red-300 disabled:hover:bg-red-300"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
        <div className="text-red-700 text-sm text-center">
          <div>{errors.password?.message}</div>
          <div>{errors.identifier?.message}</div>
          <div>{errors.root?.serverError?.message}</div>
        </div>

        <DevTool control={control} />
      </form>
    </div>
  );
};
