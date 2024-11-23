import { apiSlice } from "../../api";
import { UserType } from "../../utils/types";

const usersApi = apiSlice.injectEndpoints({
  endpoints: (bulider) => ({
    getUsers: bulider.query<{ users: UserType[] }, void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    getUser: bulider.query<{ user: UserType }, void>({
      query: (userId) => `/users/${userId}`,
      providesTags: ["Users"],
    }),
    deleteUser: bulider.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery, useDeleteUserMutation } =
  usersApi;
