import { createReducer } from '@reduxjs/toolkit'
import { clearRedirect, loginUserSuccess, updateRedirect, updateUser } from './userActions'
import { User } from '@frontend/common'

interface UserState {
  userLoggedIn: boolean
  redirect: null | Function
  user: null | User
}

const initialState: UserState = {
  userLoggedIn: false,
  redirect: null,
  user: null,
}

const userReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(loginUserSuccess, (state) => {
      state.userLoggedIn = true
    })
    .addCase(updateRedirect, (state, action) => {
      state.redirect = action.payload
    })
    .addCase(clearRedirect, (state) => {
      state.redirect = null
    })
    .addCase(updateUser, (state, action) => {
      state.user = action.payload
    })
)

export default userReducer
