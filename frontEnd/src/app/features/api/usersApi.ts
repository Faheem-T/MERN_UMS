import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { LoginUser, User } from "../../ZodSchemas/userSchema";
import { RootState } from "../../store";
import { authState, userLoggedIn, userLoggedOut } from "../auth/authSlice";

export interface AuthData {
  data: authState;
  success: boolean;
  message: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000",
  credentials: "include",
  prepareHeaders: async (headers, { getState }) => {
    headers.set("Accept", "application/json");
    const accessToken = (getState() as RootState).auth.accessToken;
    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 403) {
    console.log("Refreshing access token...");
    try {
      const { data: refreshResult, error } = await baseQuery(
        "api/auth/refresh",
        api,
        extraOptions
      );
      if (error) throw error;
      // const {} = result.data;
      console.log(refreshResult);
      if (refreshResult) {
        const { user } = (api.getState() as RootState).auth;
        const { accessToken } = refreshResult.data;
        api.dispatch(userLoggedIn({ user, accessToken }));
        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(userLoggedOut());
      }
    } catch (error) {
      console.log(error);
      console.log("Refresh failed, logging out user...");
      api.dispatch(userLoggedOut());
      // await api.dispatch(usersApi.endpoints.logOutUser.initiate()).unwrap();
    }
  }
  return result;
};

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "User"],
  endpoints: (builder) => ({
    initialCheck: builder.query<AuthData, void>({
      query: () => "/api/auth/initialCheck",
    }),
    registerUser: builder.mutation<AuthData, User>({
      // TODO: look into what the return type is
      query: (user) => ({
        url: "/api/auth/register",
        method: "POST",
        body: user,
      }),
    }),

    loginUser: builder.mutation<AuthData, LoginUser>({
      query: (user) => ({
        url: "/api/auth/login",
        method: "POST",
        body: user,
      }),
    }),

    checkStatus: builder.query<void, void>({
      query: () => "/api/auth/status",
    }),

    // refreshAccessToken: builder.query<AuthData, void>({
    //   query: () => "/api/auth/refresh",
    //   // providesTags: ["Auth"],
    // }),

    protectedRoute: builder.query<any, void>({
      query: () => "/protected",
    }),

    logOutUser: builder.mutation<void, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
      // invalidatesTags: ["Auth"],
      onQueryStarted: async (_, { dispatch }) => {
        // Clear the user state after logout
        dispatch(usersApi.util.resetApiState());
        dispatch(userLoggedOut());
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useCheckStatusQuery,
  // useRefreshAccessTokenQuery,
  useProtectedRouteQuery,
  useLogOutUserMutation,
  useInitialCheckQuery,
} = usersApi;
