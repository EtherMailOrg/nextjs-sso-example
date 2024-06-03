import { createSlice } from '@reduxjs/toolkit';

export const loginDataProviderSlice = createSlice({
  name: 'loginData',
  initialState: {
    value: undefined
  },
  reducers: {
    reset: state => {
      state.value = undefined
    },
    setData: (state, action) => {
      state.value = action.payload
    },
  }
})

export const _loginDataProvider = loginDataProviderSlice.actions;
export default loginDataProviderSlice.reducer;