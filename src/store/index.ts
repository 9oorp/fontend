import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./modules/user"; // Import userReducer here
import curriculumReducer from "./modules/curriculum"; // Import curriculumReducer here
const store = configureStore({
  reducer: {
    user: userReducer,
    curriculum: curriculumReducer,
  },
});

export default store;
