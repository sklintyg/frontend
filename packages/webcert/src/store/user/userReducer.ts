import { createReducer } from '@reduxjs/toolkit'
import { updateInactivateAutomaticLogout, updateUser, updateUserPreference } from './userActions'
import { User } from '@frontend/common'

interface UserState {
  user: null | User
  inactiveAutomaticLogout: boolean
}

const initialState: UserState = {
  user: null,
  inactiveAutomaticLogout: false,
}

const userReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateUser, (state, action) => {
      state.user = action.payload
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
    .addCase(updateInactivateAutomaticLogout, (state, action) => {
      state.inactiveAutomaticLogout = action.payload
    })
)

export default userReducer
