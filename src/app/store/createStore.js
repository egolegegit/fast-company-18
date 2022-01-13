import { configureStore, combineReducers } from "@reduxjs/toolkit";
import professionsReducer from "./professions";
import qualitiesReducer from "./qualities";

const rootReducer = combineReducers({
    qualities: qualitiesReducer,
    professions: professionsReducer
});

export function createSore() {
    return configureStore({
        reducer: rootReducer
    });
}
