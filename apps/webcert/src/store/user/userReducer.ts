import { ResourceLink, User, UserStatistics } from '@frontend/common/types'
import { createReducer } from '@reduxjs/toolkit'
import {
  removeResourceLink,
  updateInactivateAutomaticLogout,
  updateIsCareProviderModalOpen,
  updateIsLoadingUser,
  updateIsLoadingUserStatistics,
  updateUser,
  updateUserPreference,
  updateUserResourceLinks,
  updateUserStatistics,
} from './userActions'

export interface UserState {
  user: null | User
  links: ResourceLink[]
  inactiveAutomaticLogout: boolean
  isLoadingUser: boolean
  userStatistics?: UserStatistics
  isLoadingUserStatistics: boolean
  isCareProviderModalOpen: boolean
}

const initialState: UserState = {
  user: null,
  links: [],
  inactiveAutomaticLogout: false,
  isLoadingUser: true,
  userStatistics: undefined,
  isLoadingUserStatistics: false,
  isCareProviderModalOpen: false,
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
    .addCase(updateUserStatistics, (state, action) => {
      state.userStatistics = action.payload
    })
    .addCase(updateIsLoadingUserStatistics, (state, action) => {
      state.isLoadingUserStatistics = action.payload
    })
    .addCase(updateIsCareProviderModalOpen, (state, action) => {
      state.isCareProviderModalOpen = action.payload
    })
    .addCase(removeResourceLink, (state, action) => {
      state.links = state.links.filter((link) => link.type !== action.payload)
    })
)

export default userReducer
