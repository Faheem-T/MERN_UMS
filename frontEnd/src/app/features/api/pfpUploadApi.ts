import { apiSlice } from "../../api";

const pfpUploadApi = apiSlice.injectEndpoints({
  endpoints: (bulider) => ({
    uploadPfp: bulider.mutation({
      query: (args: { pfpUrl: string; userId: string }) => ({
        url: "/pfp/upload",
        method: "POST",
        body: args,
        // headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useUploadPfpMutation } = pfpUploadApi;
