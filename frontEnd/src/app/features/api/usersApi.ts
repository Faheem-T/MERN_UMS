import { apiSlice } from "../../api";
import { UserType } from "../../utils/types";

const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<{ users: UserType[] }, void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    getUser: builder.query<{ user: UserType }, void>({
      query: (userId) => `/users/${userId}`,
      providesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ userId, updateUser }) => ({
        url: `/users/${userId}`,
        method: "PATCH",
        body: updateUser,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = usersApi;
