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
      return thunkAPI.rejectWithValue({message: JSON.stringify(e.response.data)});
    }
  }
);

export const sendCoin = createAsyncThunk(
  'account/sendCoin',
  async ({ currency, amount, receiver, success, fallback }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("currency", currency.toLowerCase());
      formData.append("amount", amount);
      formData.append("recipient", receiver);

      const response = await api.post('/wallet/crypto/transfer', formData);
      let data = await response.data;
      if (response.status === 200) {
        success();
        return { ...data.data };
      } else {
        fallback();
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      fallback();
      return thunkAPI.rejectWithValue({message: JSON.stringify(e.response.data)});
    }
  }
);

export const getFiatBalance = createAsyncThunk(
  'account/fiatbalance',
  async ({ currency }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("currency", currency);

      const response = await api.post('/wallet/fiat/get_balance', formData);

      let data = await response.data;
      if (response.status === 200) {
        const res = await api.post('/wallet/fiat/get_activities', formData);
        let activities = await res.data;
        return { 
          balance: {
            address: localStorage.getItem('username'),
            available_balance: data.data.available_balance,
            cur_balance: data.data.current_balance
          }, 
          activities: activities.data 
        };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue({message: JSON.stringify(e.response.data)});
    }
  }
);

export const addFunds = createAsyncThunk(
  'account/addFunds',
  async ({ currency, amount, email, payment_method_id, success, fallback }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("currency", currency);
      formData.append("amount", amount);
      formData.append("email", email);
      formData.append("payment_method_id", payment_method_id);

      const response = await api.post('/wallet/fiat/topup', formData);
      let data = await response.data;
      if (response.status === 200) {
        success();
        return { ...data.data };
      } else {
        fallback();
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      fallback();
      return thunkAPI.rejectWithValue({message: JSON.stringify(e.response.data)});
    }
  }
);

export const sendFiat = createAsyncThunk(
  'account/sendFiat',
  async ({ currency, amount, receiver, success, fallback }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("currency", currency);
      formData.append("amount", amount);
      formData.append("recipient", receiver);

      const response = await api.post('/wallet/fiat/transfer', formData);
      let data = await response.data;
      if (response.status === 200) {
        success();
        return { ...data.data };
      } else {
        fallback();
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      fallback();
      return thunkAPI.rejectWithValue({message: JSON.stringify(e.response.data)});
    }
  }
);

export const closeWallet = createAsyncThunk(
  'account/closeWallet',
  async ({ success, fallback }, thunkAPI) => {
    try {
      const formData = new FormData();
      const response = await api.post('/wallet/close', formData);
      let data = await response.data;
      if (response.status === 200) {
        success();
        return { ...data.data };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue({message: JSON.stringify(e.response.data)});
    }
  }
);

export const changeWallet = createAsyncThunk(
  'account/changeWallet',
  async ({ name, success, fallback }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      const response = await api.post('/wallet/change_name', formData);
      let data = await response.data;
      if (response.status === 200) {
        success();
        return { ...data.data };
      } else {
        fallback();
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      fallback();
      return thunkAPI.rejectWithValue({message: JSON.stringify(e.response.data)});
    }
  }
);

export const getWallet = createAsyncThunk(
  'account/getWallet',
  async ({ }, thunkAPI) => {
    try {
      const formData = new FormData();
      const response = await api.post('/wallet/get_info', formData);
      let data = await response.data;
      if (response.status === 200) {
        return { ...data.data };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue({message: JSON.stringify(e.response.data)});
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
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;

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
      state.errorMessage = payload.message;
    },
    [sendCoin.fulfilled]: (state, { payload }) => {
      console.log('payload', payload);
      state.isFetching = false;
      state.isSuccess = true;
    },
    [sendCoin.pending]: (state) => {
      state.isFetching = true;
    },
    [sendCoin.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
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
      state.errorMessage = payload.message;
    },
    [addFunds.fulfilled]: (state, { payload }) => {
      console.log('payload', payload);
      state.isFetching = false;
      state.isSuccess = true;
    },
    [addFunds.pending]: (state) => {
      state.isFetching = true;
    },
    [addFunds.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [sendFiat.fulfilled]: (state, { payload }) => {
      console.log('payload', payload);
      state.isFetching = false;
      state.isSuccess = true;
    },
    [sendFiat.pending]: (state) => {
      state.isFetching = true;
    },
    [sendFiat.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
  },
})

export const { setCurrency, clearState } = accountSlice.actions;

export const accountSelector = state => state.account
