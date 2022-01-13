import { createAction, createSlice } from "@reduxjs/toolkit";
import authService from "../services/auth.service";
import localStorageService from "../services/localStorage.service";
import userService from "../services/user.service";
import getRandomInt from "../utils/getRandomInt";

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
        },
        userCreated: (state, action) => {
            state.entities.push(action.payload);
        }
    }
});

const { reducer: usersReducer, actions } = usersSlice;
const {
    usersRequested,
    usersRequestedFailed,
    usersReceved,
    authRequestSuccess,
    authRequestFailed,
    userCreated
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
const userCreateRequested = createAction("users/userCreateRequested");
const createUserFailed = createAction("users/userCreateFailed");

const createUser = (payload) => async (dispatch) => {
    dispatch(userCreateRequested());
    try {
        const { content } = await userService.create(payload);
        dispatch(userCreated(content));
    } catch (error) {
        dispatch(createUserFailed(error.message));
    }
};

export const signUp =
    ({ email, password, ...rest }) =>
    async (dispatch) => {
        dispatch(authRequested());
        try {
            const data = await authService.register({ email, password });
            localStorageService.setTokens(data);
            dispatch(authRequestSuccess({ userId: data.localId }));
            dispatch(
                createUser({
                    _id: data.localId,
                    email,
                    rate: getRandomInt(1, 5),
                    completedMeetings: getRandomInt(0, 200),
                    image: `https://avatars.dicebear.com/api/avataaars/${(
                        Math.random() + 1
                    )
                        .toString(36)
                        .substring(7)}.svg`,
                    ...rest
                })
            );
        } catch (error) {
            dispatch(authRequestFailed(error.message));
        }
    };

export const getUsersList = () => (state) => state.users.entities;
export default usersReducer;
