import { configureStore } from "@reduxjs/toolkit";
import reducer from "./modules/user"; // Adjust this import path to your rootReducer location

const store = configureStore({
  reducer: reducer,
});

export default store;
