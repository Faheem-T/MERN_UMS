import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { LoginUser, User } from "../../ZodSchemas/userSchema";
import { AppDispatch, RootState } from "../../store";
import { authState, userLoggedIn, userLoggedOut } from "../auth/authSlice";

interface AuthData {
  data: authState;
  success: boolean;
  message: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000",
  credentials: "include",
  prepareHeaders: async (headers, { getState }) => {
    headers.set("Accept", "application/json");
    // const authData = usersApi.endpoints.refreshAccessToken.select()(
    //   getState() as RootState
    // )?.data;

    // const authData = usersApi.endpoints.refreshAccessToken.select();
    // console.log("State in prepareHeaders:", authData);
    // const authData = usersApi.endpoints.checkStatus.select(undefined)(
    //   getState() as RootState
    // )?.data;
    // console.log(authData);
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
    // Don't retry if the refresh token endpoint itself returns 401
    // console.log("inside reauth: ", api.endpoint);
    // // console.log(result.error?.data.message);
    // if (
    //   api.endpoint === "refreshAccessToken"
    //   // ||
    //   // api.endpoint === "checkStatus"
    // ) {
    //   console.log("Refresh token expired, logging out...");
    //   await api.dispatch(usersApi.endpoints.logOutUser.initiate()).unwrap();
    //   return result;
    // }

    console.log("Refreshing access token...");
    try {
      // const refreshResult = await api
      //   .dispatch(usersApi.endpoints.refreshAccessToken.initiate())
      //   .unwrap();
      const refreshResult = baseQuery("api/auth/refresh", api, extraOptions);
      console.log(refreshResult);

      if (refreshResult) {
        const { user } = (api.getState() as RootState).auth;
        const { refreshToken } = refreshResult;
        api.dispatch(userLoggedIn({ user, refreshToken }));
        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(userLoggedOut);
      }
    } catch (error) {
      console.log(error);
      console.log("Refresh failed, logging out user...");
      await api.dispatch(usersApi.endpoints.logOutUser.initiate()).unwrap();
    }
  }
  return result;
};

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "User"],
  endpoints: (builder) => ({
    registerUser: builder.mutation<AuthData, User>({
      // TODO: look into what the return type is
      query: (user) => ({
        url: "/api/auth/register",
        method: "POST",
        body: user,
      }),
      // invalidatesTags: ["Auth"],
    }),

    loginUser: builder.mutation<AuthData, LoginUser>({
      query: (user) => ({
        url: "/api/auth/login",
        method: "POST",
        body: user,
      }),
      // invalidatesTags: ["Auth"],
    }),

    checkStatus: builder.query<void, void>({
      query: () => "/api/auth/status",
      // providesTags: ["Auth"],
    }),

    refreshAccessToken: builder.query<AuthData, void>({
      query: () => "/api/auth/refresh",
      // providesTags: ["Auth"],
    }),

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
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useCheckStatusQuery,
  useRefreshAccessTokenQuery,
  useProtectedRouteQuery,
  useLogOutUserMutation,
} = usersApi;

// Helper hooks for auth state
// export const useAuth = () => {
//   const { data: authData, isLoading } = useRefreshAccessTokenQuery();

//   return {
//     user: authData?.user,
//     accessToken: authData?.accessToken,
//     isAuthenticated: !!authData?.accessToken,
//     isLoading,
//   };
// };
