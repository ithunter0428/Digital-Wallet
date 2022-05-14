import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGIN_SUCCESS,
} from "../actions/Types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: false,
  userID: localStorage.getItem("userID"),
  userName: localStorage.getItem("userName"),
};

export default function (state = initialState, action) {
  let isAuthenticatedCondition = false;
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.token.token);
      localStorage.setItem("userID", action.payload.id);
      localStorage.setItem("userName", action.payload.username);
      console.log("action.token.token => ", action.token.token);
      console.log("user => ", action.payload.id);
      return {
        ...state,
        ...action.payload,
        ...action.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case USER_LOADED:
      if (localStorage.getItem("userID")) {
        isAuthenticatedCondition = true;
      }
      return {
        ...state,
        token: localStorage.getItem("token"),
        userID: localStorage.getItem("userID"),
        userName: localStorage.getItem("userName"),
        isLoading: false,
        isAuthenticated: isAuthenticatedCondition,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
      localStorage.removeItem("token");
      localStorage.removeItem("userID");
      localStorage.removeItem("userName");
      return {
        ...state,
        token: null,
        userID: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}
