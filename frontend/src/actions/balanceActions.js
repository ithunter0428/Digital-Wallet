import axios from "axios";
import { TRANSFER, TOPUP, GET_BALANCE, BALANCE_LOADING } from "./Types";

const url = "http://127.0.0.1:8000/wallet/";

export const getBalance = (token, userID) => async (dispatch) => {
  dispatch(setLoading());
  const headers = {
    "Content-type": "application/json",
    Authorization: `Token ${token}`,
  };
  let urlBalance = url + `totalbalance/${userID}/`;
  let urlBankUser = url + `bankuser/${userID}/`;
  let urlBank = url + `bank/`;
  const res = await axios.get(urlBalance, {
    headers: headers,
  });
  const dataBalance = await res.data;
  console.log("data ", dataBalance);

  const resDropdownBankUser = await axios.get(urlBankUser, {
    headers: headers,
  });
  const dataDropdownBankUser = await resDropdownBankUser.data;
  console.log("dataDropdowm ", dataDropdownBankUser);

  const resDropdownBank = await axios.get(urlBank, {
    headers: headers,
  });
  const dataDropdownBank = await resDropdownBank.data;
  console.log("dataDropdowm ", dataDropdownBank);
  dispatch({
    type: GET_BALANCE,
    payload: dataBalance.data.balance__sum,
    dropdownBankUser: dataDropdownBankUser,
    dropdownBank: dataDropdownBank,
  });
};

export const topUpMoney = (token, userID, newData) => (dispatch) => {
  // user, bank, balance_after
  console.log("newData ", newData);
  const headers = {
    "Content-type": "application/json",
    Authorization: `Token ${token}`,
  };
  const uploadData = new FormData();
  uploadData.append("user", userID);
  uploadData.append("bank", newData.bank);
  uploadData.append("balance_after", newData.balance_after);
  let urlSend = url + `topup/`;
  axios
    .post(urlSend, uploadData, {
      headers: headers,
    })
    .then((res) => {
      console.log("topUpMoney res.data= ", res.data);
      dispatch({
        type: TOPUP,
        payload: res.data.data.balance__sum,
      });
    });
};

export const transferMoney = (token, userID, newData) => (dispatch) => {
  // # user
  // # bank
  // # user_agent -> send to
  // # balance_after -> amount
  // # send_to_bank
  const headers = {
    "Content-type": "application/json",
    Authorization: `Token ${token}`,
  };
  const uploadData = new FormData();
  uploadData.append("user", userID);
  uploadData.append("bank", newData.bank);
  uploadData.append("user_agent", newData.user_agent);
  uploadData.append("send_to_bank", newData.send_to_bank);
  uploadData.append("balance_after", newData.balance_after);
  let urlSend = url + `transfer/`;
  axios
    .post(urlSend, uploadData, {
      headers: headers,
    })
    .then((res) => {
      console.log("res.data=", res.data);
      dispatch({
        type: TRANSFER,
        payload: res.data.data.balance__sum,
      });
    });
};

export const setLoading = () => {
  return {
    type: BALANCE_LOADING,
  };
};
