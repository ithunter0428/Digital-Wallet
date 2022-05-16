import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './pages/auth/authSlice'
import { accountSlice } from './pages/home/accountSlice'

export default configureStore({
  reducer: {
    auth: authSlice.reducer,
    account: accountSlice.reducer,
  },
})