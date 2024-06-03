import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EtherMailProvider } from "@ethermail/ethermail-wallet-provider";

export const ethermailProviderSlice = createSlice({
  name: 'ethermailProvider',
  initialState: {
    value: undefined
  },
  reducers: {
    reset: state => {
      state.value = undefined
    },
    setProvider: (state, action: PayloadAction<EtherMailProvider>) => {
      state.value = action.payload
    },
  }
})

export const _ethermailProvider = ethermailProviderSlice.actions;
export default ethermailProviderSlice.reducer;