import { configureStore, combineReducers } from "@reduxjs/toolkit";
import professionsReducer from "./professions";
import qualitiesReducer from "./qualities";
import usersReducer from "./users";

const rootReducer = combineReducers({
    qualities: qualitiesReducer,
    professions: professionsReducer,
    users: usersReducer
});

export function createSore() {
    return configureStore({
        reducer: rootReducer
    });
}
