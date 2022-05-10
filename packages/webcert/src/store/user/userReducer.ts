import { createReducer } from '@reduxjs/toolkit'
import {
  updateInactivateAutomaticLogout,
  updateIsLoadingUser,
  updateUser,
  updateUserPreference,
  updateUserResourceLinks,
  updateUserTabs,
} from './userActions'
import { ResourceLink, User, UserTab } from '@frontend/common'

interface UserState {
  user: null | User
  links: ResourceLink[]
  inactiveAutomaticLogout: boolean
  isLoadingUser: boolean
  tabs: UserTab[]
}

const initialState: UserState = {
  user: null,
  links: [],
  inactiveAutomaticLogout: false,
  isLoadingUser: true,
  tabs: [],
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
    .addCase(updateIsLoadingUser, (state, action) => {
      state.isLoadingUser = action.payload
    })
    .addCase(updateUserTabs, (state, action) => {
      state.tabs = action.payload
    })
)

export default userReducer
