import { combineReducers } from "redux";
import authReducer from "./authReducer";
import balanceReducer from "./balanceReducer";

export default combineReducers({
  auth: authReducer,
  balance: balanceReducer,
});
