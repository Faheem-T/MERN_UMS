import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username has to have more than 3 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(5, "Password has to have atleast 5 characters"),
  email: z
    .string()
    .email("Email format is not valid")
    .min(1, "Email is required"),
});

export type User = z.infer<typeof userSchema>;

export const loginUserSchema = z.object({
  identifier: z.string().min(1, "Username / Email is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginUser = z.infer<typeof loginUserSchema>;

export const editUserSchema = z.object({
  email: z.string().min(1, "Email is required"),
  username: z.string().min(1, "Username is required"),
});

export type EditUser = z.infer<typeof editUserSchema>;
