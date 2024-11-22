import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { userLoggedIn, userLoggedOut } from "./features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api",
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
  console.log(args);
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 403) {
    console.log("Refreshing access token...");
    try {
      const { data: refreshResult, error } = await baseQuery(
        "auth/refresh",
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

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["Auth", "Users"],
});
