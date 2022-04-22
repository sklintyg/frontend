import { createReducer } from '@reduxjs/toolkit'
import {
  updateCertificateTypes,
  updateInactivateAutomaticLogout,
  updateIsLoadingUser,
  updateUser,
  updateUserPreference,
  updateUserResourceLinks,
} from './userActions'
import { CertificateType, ResourceLink, User } from '@frontend/common'

interface UserState {
  user: null | User
  links: ResourceLink[]
  inactiveAutomaticLogout: boolean
  isLoadingUser: boolean
  certificateTypes: CertificateType[]
}

const initialState: UserState = {
  user: null,
  links: [],
  inactiveAutomaticLogout: false,
  isLoadingUser: true,
  certificateTypes: [],
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
    .addCase(updateCertificateTypes, (state, action) => {
      state.certificateTypes = Object.values(action.payload)
    })
)

export default userReducer
