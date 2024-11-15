import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { User } from "../../ZodSchemas/userSchema";
import { userLoggedIn, userLoggedOut } from "../auth/authSlice";
import { RootState } from "../../store";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Accept", "application/json");
    // Get token from state
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      // Add authorization header
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    console.log("Refreshing access token...");

    try {
      // Refresh the access token
      const refreshResult = await api
        .dispatch(usersApi.endpoints.refreshAccessToken.initiate({}))
        .unwrap();
      console.log("got refresh result", refreshResult);
      // update the access token in the store
      api.dispatch(userLoggedIn(refreshResult));

      // Retry the original query
      result = await baseQuery(args, api, extraOptions);
    } catch (error) {
      console.log(error);
      console.log("refresh token is invalid, logging out user...");
      api.dispatch(userLoggedOut());
    }
  }
  return result;
};

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseQueryWithReauth,
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
        // function to set user data in store state on user log in
        onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
          try {
            const { data } = await queryFulfilled;
            dispatch(userLoggedIn(data));
          } catch (err) {
            console.log(err);
          }
        },
      }),
      checkStatus: builder.query({ query: () => "/api/auth/status" }),
      refreshAccessToken: builder.query({
        query: () => "/api/auth/refresh",
        onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
          try {
            const { data } = await queryFulfilled;
            dispatch(userLoggedIn(data));
          } catch (err) {
            console.log(err);
          }
        },
      }),
      protectedRoute: builder.query({ query: () => "/protected" }),
    };
  },
});

export const {
  useGetUsersQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useCheckStatusQuery,
  useRefreshAccessTokenQuery,
  useProtectedRouteQuery,
} = usersApi;
