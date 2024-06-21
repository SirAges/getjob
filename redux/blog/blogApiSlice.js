import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const RN_APP_RAPIDAPI_KEY =
    "90cb4e2e96msha4cf5c7cdd5d2aap14cbedjsna34c923d5eaa";
const RN_APP_NEWS_API_HOST = "google-api31.p.rapidapi.com";
const RN_APP_NEWS_API_URL = "https://google-api31.p.rapidapi.com";

const blogNewsHeaders = {
    "x-rapidapi-key": RN_APP_RAPIDAPI_KEY,
    "x-rapidapi-host": RN_APP_NEWS_API_HOST,

    "Content-Type": "application/json"
};


export const blogApiSlice = createApi({
    reducerPath: "blogNewsApi",
    baseQuery: fetchBaseQuery({ baseUrl: RN_APP_NEWS_API_URL }),
    endpoints: builder => ({
        getBlogNews: builder.mutation({
            query: text => ({
                url: "/",
                method: "POST",
                headers: blogNewsHeaders,
                body: {
                    text,
                    region: "ng",
                    max_results: 10
                },
                validateStatus: response => {
                    return response.status === 200;
                }
                // responseHandler: "text"
            })
        })
    })
});

export const { useGetBlogNewsMutation } = blogApiSlice;
