import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      if (!action.payload.timestamp) {
        action.payload.timestamp = Date.now();
      }
      state.posts.push(action.payload);
    },
    updatePost: (state, action) => {
      const idx = state.posts.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.posts[idx] = action.payload;
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
  },
});

export const { setPosts, addPost, updatePost, removePost } = postsSlice.actions;
export default postsSlice.reducer;