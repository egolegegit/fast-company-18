import { createAction, createSlice } from "@reduxjs/toolkit";
import authService from "../services/auth.service";
import localStorageService from "../services/localStorage.service";
import userService from "../services/user.service";

const usersSlice = createSlice({
    name: "users",
    initialState: {
        entities: null,
        isloading: true,
        error: null,
        auth: null,
        isLoggedIn: false
    },
    reducers: {
        usersReceved: (state, action) => {
            state.entities = action.payload;
            state.lastFetch = Date.now();
            state.isloading = false;
        },
        usersRequested: (state) => {
            state.isLoading = true;
        },
        usersRequestedFailed(state, action) {
            state.error = action.payload;
            state.isLoading = false;
        },
        authRequestSuccess: (state, action) => {
            state.auth = { ...action.payload, isLoggedIn: true };
        },
        authRequestFailed: (state, action) => {
            state.error = action.payload;
        }
    }
});

const { reducer: usersReducer, actions } = usersSlice;
const {
    usersRequested,
    usersRequestedFailed,
    usersReceved,
    authRequestSuccess,
    authRequestFailed
} = actions;

export const loadUsersList = () => async (dispatch, getState) => {
    const { lastFetch } = getState().users;
    console.log(lastFetch);

    dispatch(usersRequested());

    try {
        const { content } = await userService.get();
        dispatch(usersReceved(content));
    } catch (error) {
        dispatch(usersRequestedFailed(error.message));
    }
};

export const getUserById = (userId) => (state) => {
    if (state.users.entities) {
        return state.users.entities.find((item) => item._id === userId);
    }
};

const authRequested = createAction("users/requested");

export const signUp =
    ({ email, password, ...rest }) =>
    async (dispatch) => {
        dispatch(authRequested());
        try {
            const data = await authService.register({ email, password });
            localStorageService.setTokens(data);
            dispatch(authRequestSuccess({ userId: data.localId }));
        } catch (error) {
            dispatch(authRequestFailed(error.message));
        }
    };

export const getUsersList = () => (state) => state.users.entities;
export default usersReducer;
