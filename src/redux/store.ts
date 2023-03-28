import { configureStore } from "@reduxjs/toolkit";
import { projectsReducer } from "./slices/projects";
import { authReducer } from "./slices/auth";
import { accountReducer } from "./slices/account";

const store = configureStore({
  reducer: {
    projects: projectsReducer,
    auth: authReducer,
    account: accountReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export default store;
