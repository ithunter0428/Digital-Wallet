import axios from "axios";
// import { returnErrors } from "./errorActions";

import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGIN_SUCCESS,
} from "./Types";

const url = "http://127.0.0.1:8000/";

export const loadUser = () => {
  return {
    type: USER_LOADED,
  };
};

export const loginUser = (dataLogin) => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  let urlLogin = url + "auth/";
  let urlUser = url + "wallet/user/";
  const uploadData = new FormData();
  uploadData.append("username", dataLogin.username);
  uploadData.append("password", dataLogin.password);

  const res = await axios.post(urlLogin, uploadData);
  const dataToken = await res.data;
  console.log("data ", dataToken);
  const headers = {
    "Content-type": "application/json",
    Authorization: `Token ${dataToken.token}`,
  };

  const resUser = await axios.post(urlUser, uploadData, {
    headers: headers,
  });
  const dataUser = await resUser.data;
  console.log("dataUser ", dataUser);

  dispatch({
    type: LOGIN_SUCCESS,
    payload: dataUser,
    token: dataToken,
  });
};

export const logoutUser = (token, userID) => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  const headers = {
    "Content-type": "application/json",
    Authorization: `Token ${token}`,
  };
  let urlLogout = url + `wallet/logout/${userID}/`;
  const res = await axios.get(urlLogout, {
    headers: headers,
  });
  const dataBalance = await res.data;
  console.log("data ", dataBalance);

  dispatch({
    type: LOGOUT_SUCCESS,
  });
};
