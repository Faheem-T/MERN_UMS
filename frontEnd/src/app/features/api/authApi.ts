import { LoginUser, User } from "../../ZodSchemas/userSchema";
import { authState, userLoggedOut } from "../auth/authSlice";
import { apiSlice } from "../../api";

export interface AuthData {
  data: authState;
  success: boolean;
  message: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    initialCheck: builder.query<AuthData, void>({
      query: () => "/auth/initialCheck",
      providesTags: ["User"],
    }),
    registerUser: builder.mutation<AuthData, User>({
      // TODO: look into what the return type is
      query: (user) => ({
        url: "/auth/register",
        method: "POST",
        body: user,
      }),
    }),

    loginUser: builder.mutation<AuthData, LoginUser>({
      query: (user) => ({
        url: "/auth/login",
        method: "POST",
        body: user,
      }),
    }),

    checkStatus: builder.query<void, void>({
      query: () => "/auth/status",
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
        url: "/auth/logout",
        method: "POST",
      }),
      // invalidatesTags: ["Auth"],
      onQueryStarted: async (_, { dispatch }) => {
        // Clear the user state after logout
        dispatch(authApi.util.resetApiState());
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
} = authApi;
