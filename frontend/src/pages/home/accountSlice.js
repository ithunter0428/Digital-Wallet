import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { currencies } from '../../currencies';

export const getCoinBalance = createAsyncThunk(
  'account/coinbalance',
  async ({ currency }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("currency", currency.toLowerCase());

      const response = await api.post('/wallet/crypto/get_balance', formData);

      let data = await response.data;
      if (response.status === 200) {
        const res = await api.post('/wallet/crypto/get_activities', formData);
        let activities = await res.data;

        return { balance: data.data, activities: activities.data };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue({message: e.response.statusText});
    }
  }
);

export const sendCoin = createAsyncThunk(
  'account/sendCoin',
  async ({ currency, amount, receiver }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("currency", currency.toLowerCase());
      formData.append("amount", amount);
      formData.append("receiver", receiver);

      const response = await api.post('/wallet/crypto/transfer', formData);

      let data = await response.data;
      console.dir(response)
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

export const getFiatBalance = createAsyncThunk(
  'account/fiatbalance',
  async ({ currency }, thunkAPI) => {
    try {
      return {
        balance: { 
          address: "",
          available_balance: "0",
          cur_balance: "0" 
        },
        activities: []
      };
    } catch (e) {
      return thunkAPI.rejectWithValue({message: e.response.statusText});
    }
  }
);

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    currency: {
      name: "USD",
      symbol: "$",
      type: "fiat",
    },
    balance: {
      address: "",
      available_balance: "0",
      cur_balance: "0"
    },
    isFetching: false,
    isSuccess: true,
    errorMessage: ""
  },
  reducers: {
    setCurrency: (state, { payload }) => {
      state.currency.name = payload;
      const currencyInfo = currencies.find(item => item.name == payload );
      state.currency.type = currencyInfo? currencyInfo.type: "";
      state.currency.symbol = currencyInfo? currencyInfo.symbol: "";

      return state;
    },
  },
  extraReducers: {
    [getCoinBalance.fulfilled]: (state, { payload }) => {
      console.log('payload', payload);
      state.isFetching = false;
      state.isSuccess = true;
      state.balance = payload.balance;
      state.activities = payload.activities;
    },
    [getCoinBalance.pending]: (state) => {
      state.isFetching = true;
    },
    [getCoinBalance.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = JSON.stringify(payload);
    },
    [getFiatBalance.fulfilled]: (state, { payload }) => {
      console.log('payload', payload);
      state.isFetching = false;
      state.isSuccess = true;
      state.balance = payload.balance;
      state.activities = payload.activities;
    },
    [getFiatBalance.pending]: (state) => {
      state.isFetching = true;
    },
    [getFiatBalance.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = JSON.stringify(payload);
    },
  },
})

export const { setCurrency } = accountSlice.actions;

export const accountSelector = state => state.account
