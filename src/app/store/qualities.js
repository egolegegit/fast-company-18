import { createSlice } from "@reduxjs/toolkit";
import qualityService from "../services/qaulity.service";

const qualitiesSlice = createSlice({
    name: "qualities",
    initialState: { entities: null, isloading: true, error: null },
    reducers: {
        qualitiesReceved: (state, action) => {
            state.entities = action.payload;
            state.isloading = false;
        },
        qualitiesRequested: (state) => {
            state.isLoading = true;
        },
        qualitiesRequestedFailed(state, action) {
            state.error = action.payload;
            state.isLoading = false;
        }
    }
});

const { reducer: qualitiesReducer, actions } = qualitiesSlice;
const { qualitiesRequested, qualitiesRequestedFailed, qualitiesReceved } =
    actions;

export const loadQualitiesList = () => async (dispatch) => {
    dispatch(qualitiesRequested());

    try {
        const { content } = await qualityService.fetchAll();
        dispatch(qualitiesReceved(content));
    } catch (error) {
        dispatch(qualitiesRequestedFailed(error.message));
    }
};

export const getQualities = () => (state) => state.qualities.entities;
export const getQualitiesLoadingStatus = () => (state) =>
    state.qualities.isLoading;

export default qualitiesReducer;
