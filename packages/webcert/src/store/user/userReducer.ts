import { createReducer } from '@reduxjs/toolkit'
import { clearRedirect, updateRedirect, updateUser, updateUserPreference } from './userActions'
import { History, LocationState } from 'history'
import { User } from '@frontend/common'

export interface LoginUserSuccess {
  certificateId: string
  history: History<LocationState>
}

export interface RedirectAction {
  type: string
  payload?: any
}

export interface LoginUserQuery {
  redirectAction?: RedirectAction
  user?: string
  // history?: any
  loginUserSuccess?: LoginUserSuccess
}

interface UserState {
  userLoggedIn: boolean
  redirect: null | RedirectAction
  user: null | User
}

const initialState: UserState = {
  userLoggedIn: false,
  redirect: null,
  user: null,
}

const userReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateRedirect, (state, action) => {
      state.redirect = action.payload
    })
    .addCase(clearRedirect, (state) => {
      state.redirect = null
    })
    .addCase(updateUser, (state, action) => {
      state.user = action.payload
      state.userLoggedIn = true
    })
    .addCase(updateUserPreference, (state, action) => {
      if (!state.user) {
        return
      }

      if (!state.user.preferences) {
        state.user.preferences = {}
      }

      state.user.preferences[action.payload.key] = action.payload.value
    })
)

export default userReducer
