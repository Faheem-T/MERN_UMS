import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../ZodSchemas/userSchema";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
    credentials: "include", // Add this line
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("accessToken", "someToken");
      return headers;
    },
  }),
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
        query: (user) => ({
          url: "/api/auth/login",
          method: "POST",
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
