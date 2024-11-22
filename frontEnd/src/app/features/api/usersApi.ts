import { apiSlice } from "../../api";
import { UserType } from "../../utils/types";

const usersApi = apiSlice.injectEndpoints({
  endpoints: (bulider) => ({
    usersList: bulider.query<{ users: UserType[] }, void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
  }),
});

export const { useUsersListQuery } = usersApi;
