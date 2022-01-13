import { createSlice } from "@reduxjs/toolkit";
import professionService from "../services/profession.service";
import isOutdated from "../utils/isOutdated";

const professionsSlice = createSlice({
    name: "professions",
    initialState: {
        entities: null,
        isloading: true,
        error: null,
        lastFetch: null
    },
    reducers: {
        professionsReceved: (state, action) => {
            state.entities = action.payload;
            state.lastFetch = Date.now();
            state.isloading = false;
        },
        professionsRequested: (state) => {
            state.isLoading = true;
        },
        professionsRequestedFailed(state, action) {
            state.error = action.payload;
            state.isLoading = false;
        }
    }
});

export const loadProfessionsList = () => async (dispatch, getState) => {
    const { lastFetch } = getState().professions;
    if (isOutdated(lastFetch)) {
        dispatch(professionsRequested());

        try {
            const { content } = await professionService.get();
            dispatch(professionsReceved(content));
        } catch (error) {
            dispatch(professionsRequestedFailed(error.message));
        }
    }
};

export const getProfessions = () => (state) => state.professions.entities;
export const getProfessionsLoadingStatus = () => (state) =>
    state.professions.isLoading;

const { reducer: professionsReducer, actions } = professionsSlice;
const { professionsRequested, professionsRequestedFailed, professionsReceved } =
    actions;

export const getProfessionById = (id) => (state) => {
    if (state.professions.entities) {
        return state.professions.entities.find((p) => p._id === id);
    }
};

export default professionsReducer;
