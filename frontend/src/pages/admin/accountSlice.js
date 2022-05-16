import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

export const confirm = createAsyncThunk(
  'account/confirm',
  async ({ tx }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("tx", tx);

      const response = await api.post('/wallet/confirm', formData);

      let data = await response.data;
      if (response.status === 200) {
        return { ...data.data };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue({message: e.response.statusText});
    }
  }
);

export const getPendingRows = createAsyncThunk(
  'account/pendingRows',
  async ({ currency }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("currency", currency);

      const response = await api.post('/wallet/pending', formData);

      let data = await response.data;
      if (response.status === 200) {
        return data.data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue({message: e.response.statusText});
    }
  }
);

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    isFetching: false,
    isSuccess: true,
    errorMessage: "",
    pendingRows: []
  },
  reducers: {
  },
  extraReducers: {
    [confirm.fulfilled]: (state, { payload }) => {
      console.log('payload', payload);
      state.isFetching = false;
      state.isSuccess = true;
    },
    [confirm.pending]: (state) => {
      state.isFetching = true;
    },
    [confirm.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = JSON.stringify(payload);
    },
    [getPendingRows.fulfilled]: (state, { payload }) => {
      console.log('payload', payload);
      state.isFetching = false;
      state.isSuccess = true;
      state.pendingRows = payload.data;
    },
    [getPendingRows.pending]: (state) => {
      state.isFetching = true;
    },
    [getPendingRows.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = JSON.stringify(payload);
    },
  },
})

export const { setCurrency } = accountSlice.actions;

export const accountSelector = state => state.account
