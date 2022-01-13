import { createSlice } from "@reduxjs/toolkit";
import professionService from "../services/profession.service";

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

function isOutdated(date) {
    if (Date.now() - date > 10 * 60 * 100) {
        return true;
    }
    return false;
}

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

export const getProfessionByIDs = (professionId) => (state) => {
    return state.entities.find((p) => p._id === professionId);
};

export default professionsReducer;
