import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../ZodSchemas/userSchema";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  endpoints: (builder) => {
    return {
      getUsers: builder.query({ query: () => "/api/users" }),
      registerUser: builder.mutation({
        query: (user: User) => ({
          url: "/api/auth/register",
          method: "POST",
          body: user,
        }),
      }),
      loginUser: builder.mutation({
        query: <T>(user: T) => ({
          url: "/api/auth/login",
          mothed: "POST",
          body: user,
        }),
      }),
    };
  },
});

export const {
  useGetUsersQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
} = usersApi;
