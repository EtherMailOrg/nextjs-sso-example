import { createSlice } from '@reduxjs/toolkit';

export const ethermailProviderSlice = createSlice({
  name: 'ethermailProvider',
  initialState: {
    value: undefined
  },
  reducers: {
    reset: state => {
      state.value = undefined
    },
    setProvider: (state, action) => {
      state.value = action.payload
    },
  }
})

export const _ethermailProvider = ethermailProviderSlice.actions;
export default ethermailProviderSlice.reducer;