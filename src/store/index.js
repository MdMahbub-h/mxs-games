import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

// convert object to string and store in localStorage
const saveToLocalStorage = (storageName, state) => {
  try {
    const serialisedState = JSON.stringify(state);
    localStorage.setItem(storageName, serialisedState);
  } catch (e) {
    console.warn(e);
  }
};

const loadFromLocalStorage = (storageName) => {
  try {
    const serialisedState = localStorage.getItem(storageName);
    if (serialisedState === null) return undefined;
    return JSON.parse(serialisedState);
  } catch (e) {
    console.warn(e);
    return undefined;
  }
};

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: { user: loadFromLocalStorage("userStore") },
});

store.subscribe(() => saveToLocalStorage("userStore", store.getState().user));

export default store;
