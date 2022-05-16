import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './pages/auth/authSlice'
import { accountSlice } from './pages/home/accountSlice'
import { adminSlice } from './pages/admin/adminSlice'

export default configureStore({
  reducer: {
    auth: authSlice.reducer,
    account: accountSlice.reducer,
    admin: adminSlice.reducer
  },
})