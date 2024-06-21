import { apiSlice } from "../../app/api/apiSlice";

import { setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: value => ({
                url: "/auth/login",
                method: "POST",
                body: value,
                responseHandler: "text"
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    if (data && data !== undefined) {
                        dispatch(setCredentials(data));
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        signup: builder.mutation({
            query: value => ({
                url: "/auth/register",
                method: "POST",
                body: value,
                responseHandler: "text"
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
                responseHandler: "text"
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                     if (data && data !== undefined) {
                        dispatch(setCredentials(null));
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: "/auth/refresh",
                method: "POST"
                // responseHandler: "text"
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    dispatch(setCredentials(data));
                } catch (err) {
                    console.log("error", err);
                }
            }
        }),
        resetPassword: builder.mutation({
            query: value => ({
                url: "/auth/resetpassword",
                method: "POST",
                body: value,
                responseHandler: "text"
            }),
           
        }),
        verifyEmail: builder.mutation({
            query: value => ({
                url: "/auth/verifyemail",
                method: "POST",
                body: value,
                responseHandler: "text"
            })
        })
    })
});

export const {
    useLoginMutation,
    useSignupMutation,
    useLogoutMutation,
    useRefreshMutation,
    useVerifyEmailMutation,
    useResetPasswordMutation
} = authApiSlice;
