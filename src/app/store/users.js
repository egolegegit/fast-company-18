import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/user.service";

const usersSlice = createSlice({
    name: "users",
    initialState: {
        entities: null,
        isloading: true,
        error: null
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
        }
    }
});

const { reducer: usersReducer, actions } = usersSlice;
const { usersRequested, usersRequestedFailed, usersReceved } = actions;

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

export const getUsersList = () => (state) => state.users.entities;
export default usersReducer;
