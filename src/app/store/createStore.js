import { configureStore, combineReducers } from "@reduxjs/toolkit";
import qualitiesReducer from "./qualities";

const rootReducer = combineReducers({ qualities: qualitiesReducer });

export function createSore() {
    return configureStore({
        reducer: rootReducer
    });
}
