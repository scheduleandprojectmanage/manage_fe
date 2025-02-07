// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import loginSlice from "./slices/loginSlice";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['loginSlice']
};

const persistedReducer = persistReducer(persistConfig, loginSlice);

const store = configureStore({
    reducer: {
        loginSlice: persistedReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export const persistor = persistStore(store);
export default store;