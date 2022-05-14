import {
  TRANSFER,
  TOPUP,
  GET_BALANCE,
  BALANCE_LOADING,
} from "../actions/Types";

const initialState = {
  balance: 0,
  dropdownBankUser: [],
  dropdownBank: [],
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_BALANCE:
      return {
        ...state,
        balance: action.payload,
        dropdownBankUser: action.dropdownBankUser,
        dropdownBank: action.dropdownBank,
        loading: false,
      };
    case TRANSFER || TOPUP:
      return {
        ...state,
        balance: action.payload,
      };
    case BALANCE_LOADING:
      return {
        ...state,
        loading: true,
      };
    default: {
      return state;
    }
  }
}
