import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./Reducers/authReducer";
import noteReducer from "./Reducers/noteReducer";
import adminReducer from "./Reducers/adminReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    note: noteReducer,
    admin: adminReducer
});

const persistConfig = {
    key: "noteshelf",
    storage: storage,
    whitelist: ["auth"]
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