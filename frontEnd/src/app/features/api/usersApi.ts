import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  endpoints: (builder) => {
    return {
      getUsers: builder.query({ query: () => "/api/users" }),
    };
  },
});

export const { useGetUsersQuery } = usersApi;
