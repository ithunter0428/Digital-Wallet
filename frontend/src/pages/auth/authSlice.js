import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, API_URL } from '../../api';
import axios from 'axios';

export const loginUser = createAsyncThunk(
  'users/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const uploadData = new FormData();
      uploadData.append("username", email);
      uploadData.append("password", password);

      const response = await api.post('/auth/login', uploadData);

      let data = await response.data;
      if (response.status === 200) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('wallet_name', data.wallet_name);
        if(data.wallet_closed != 0) {
          return thunkAPI.rejectWithValue({message: 'This wallet is closed.'});
        }

        api.interceptors.request.use(function (config) {
          const token = localStorage.getItem('token');
          config.headers.Authorization =  token ? `Token ${token}` : '';
          return config;
        });

        // const res_ = await api.post('/wallet/fiat/get_stripe_key', {});
        // data = await response.data;
        // console.log(data)
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue({message: JSON.stringify(e.response.data)});
    }
  }
);

export const signupUser = createAsyncThunk(
  'users/signupUser',
  async ({ email, password, username, password2, firstname, lastname, litecoin, bitcoin, dogecoin, secret_pin }, thunkAPI) => {
    try {
      const uploadData = new FormData();
      uploadData.append("email", email);
      uploadData.append("password", password);
      uploadData.append("password2", password2);
      uploadData.append("username", username);
      uploadData.append("first_name", firstname);
      uploadData.append("last_name", lastname);
    
      let response = await api.post('/auth/register', uploadData);
      const user = await response.data;
      if (response.status === 200 || response.status === 201) {
        const response = await api.post('/auth/login', uploadData);

        let data = await response.data;
        if (response.status === 200) {
          const coinData = new FormData();
          coinData.append("litecoin", litecoin);
          coinData.append("bitcoin", bitcoin);
          coinData.append("dogecoin", dogecoin);
          coinData.append("secret_pin", secret_pin);
          const res = await axios.post(API_URL + '/wallet/crypto/set_api_key', coinData, {
            headers: {
              "Content-type": "application/json",
              'Authorization': `Token ` + data.token
            }
          });
          if (res.status === 200 || res.status === 201) {
            return { user: user };
          } else {
            return thunkAPI.rejectWithValue(res.data);
          }
        } else {
          return thunkAPI.rejectWithValue(data);
        }
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }

    } catch (e) {
      return thunkAPI.rejectWithValue({message: JSON.stringify(e.response.data)});
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    username: '',
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
  },
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;

      return state;
    },
  },
  extraReducers: {
    [signupUser.fulfilled]: (state, { payload }) => {
      console.log('payload', payload);
      state.isFetching = false;
      state.isSuccess = true;
      state.username = payload.user.name;
    },
    [signupUser.pending]: (state) => {
      state.isFetching = true;
    },
    [signupUser.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      state.username = payload.username;
      localStorage.setItem("username", payload.username);
      state.isFetching = false;
      state.isSuccess = true;
      return state;
    },
    [loginUser.rejected]: (state, { payload }) => {
      console.log('payload', payload);
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [loginUser.pending]: (state) => {
      state.isFetching = true;
    }
  },
})

export const { clearState } = authSlice.actions;

export const authSelector = state => state.auth
