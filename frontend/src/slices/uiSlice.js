/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { removeChannel } from './channelSlice';

const defaultGeneralChannelId = 1;
const initialState = {
  pressedChannelId: defaultGeneralChannelId,
  pressedChannelAdd: false,
  pressedChannelRemove: false,
  pressedChannelRename: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setPressedChannel: (state, action) => {
      state.pressedChannelId = action.payload;
    },
    setPressedAddChannel: (state, action) => {
      state.pressedChannelAdd = action.payload;
    },
    setPressedRemoveChannel: (state, action) => {
      state.pressedChannelRemove = action.payload;
    },
    setPressedRenameChannel: (state, action) => {
      state.pressedChannelRename = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeChannel, (state) => {
        state.pressedChannelId = defaultGeneralChannelId;
      });
  },
});

export const {
  setPressedChannel,
  setPressedAddChannel,
  setPressedRemoveChannel,
  setPressedRenameChannel,
} = uiSlice.actions;
export const getPressedChannelId = (state) => state.ui.pressedChannelId;
export const getPressedAddChannel = (state) => state.ui.pressedChannelAdd;
export const getPressedRemoveChannel = (state) => state.ui.pressedChannelRemove;
export const getPressedRenameChannel = (state) => state.ui.pressedChannelRename;
export default uiSlice;
