import { createReducer } from '@reduxjs/toolkit'
import { updateInactivateAutomaticLogout, updateUser, updateUserPreference, updateUserResourceLinks } from './userActions'
import { ResourceLink, User } from '@frontend/common'

interface UserState {
  user: null | User
  links: ResourceLink[]
  inactiveAutomaticLogout: boolean
}

const initialState: UserState = {
  user: null,
  links: [],
  inactiveAutomaticLogout: false,
}

const userReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateUser, (state, action) => {
      state.user = action.payload
    })
    .addCase(updateUserResourceLinks, (state, action) => {
      state.links = action.payload
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
