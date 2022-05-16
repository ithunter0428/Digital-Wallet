import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

export const confirm = createAsyncThunk(
  'admin/confirm',
  async ({ tx, callback }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("transaction", tx);

      const response = await api.post('/wallet/fiat/confirm_topup', formData);
      let data = await response.data;
      if (response.status === 200) {
        callback();
        return { data: "success" };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue({message: JSON.stringify(e.response.data)});
    }
  }
);

export const getPendingRows = createAsyncThunk(
  'admin/getPendingRows',
  async ({ }, thunkAPI) => {
    try {
      const formData = new FormData();
      const response = await api.post('/wallet/fiat/waiting_confirm', formData);

      const data = await response.data;
      if (response.status === 200) {
        return { data: data.data};
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue({message: JSON.stringify(e.response.data)});
    }
  }
);

export const adminSlice = createSlice({
  name: 'admin',
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
      state.errorMessage = payload.message;
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
      console.log('sdf')
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
  },
})

export const { } = adminSlice.actions;

export const adminSelector = state => state.admin
