import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    sendMessage: (state, action) => {
      const { userId, message } = action.payload;
      if(!state.chats[userId]) {
        state.chats[userId] = [];
      }
      state.chats[userId].push(message);
    },
  },
});

export const { sendMessage } = chatSlice.actions;
export default chatSlice.reducer;