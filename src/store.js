import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./features/chatSlice";
import postsReducer from "./features/postsSlice";

const store = configureStore({
  reducer: {
    chat: chatReducer,
    posts: postsReducer,
  },
});

export default store;