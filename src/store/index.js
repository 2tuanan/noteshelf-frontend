import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./Reducers/authReducer";
import noteReducer from "./Reducers/noteReducer";
import adminReducer from "./Reducers/adminReducer";
import themeReducer from "./Reducers/themeReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    note: noteReducer,
    admin: adminReducer,
    theme: themeReducer
});

const persistConfig = {
    key: "noteshelf",
    storage: storage,
    whitelist: ["auth", "theme"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    "persist/PERSIST",
                    "persist/REHYDRATE",
                    "persist/FLUSH",
                    "persist/PAUSE",
                    "persist/PURGE",
                    "persist/REGISTER"
                ]
            }
        }),
    devTools: process.env.NODE_ENV !== "production"
});

export const persistor = persistStore(store);
export default store;