import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./api/apiSlice";
import { blogApiSlice } from "../redux/blog/blogApiSlice";

import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "../redux/auth/authSlice";
import jobReducer from "../redux/job/jobSlice";
import userReducer from "../redux/user/userSlice";
import blogReducer from "../redux/blog/blogSlice";
//

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [blogApiSlice.reducerPath]: blogApiSlice.reducer,
        auth: authReducer,
        user: userReducer,
        job: jobReducer,
        blog: blogReducer
    },
 middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware,blogApiSlice.middleware),
    devTools: false // Enable DevTools in development only
});

setupListeners(store.dispatch);
