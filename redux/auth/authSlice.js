import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        persist: false,
        pushToken: null
    },
    reducers: {
        setCredentials: (state, action) => {
            const accessToken = action.payload;
            state.token = accessToken;
        },
        setExpoPushToken: (state, action) => {
            const pushToken = action.payload;
            state.pushToken = pushToken;
        },

        setAsyncPersist: (state, action) => {
            return (state = { ...state, persist: action.payload });
        },
        logOut: (state, action) => {
            state.token = null;
        }
    }
});

export const { setCredentials, setAsyncPersist, setExpoPushToken, logOut } =
    authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = state => state.auth.token;
export const selectPushToken = state => state.auth.pushToken;
export const selectPersist = state => state.auth.persist;
