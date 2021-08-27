import { createReducer } from '@reduxjs/toolkit'
import { updateIcfCodes } from './icfActions'

export interface IcfCode {
  title: string
  description: string
  includes?: string
  code: string
}

export interface IcdCode {
  code: string
  title: string
}

export interface IcfIcd {
  icfCodes: IcfCode[]
  icdCodes: IcdCode[]
}

export interface Icf {
  commonCodes: IcfIcd
  uniqueCodes: IcfIcd[]
}

export interface IcfState {
  disability?: Icf
  activityLimitation?: Icf
}

const initialState: IcfState = {}

const icfReducer = createReducer(initialState, (builder) =>
  builder.addCase(updateIcfCodes, (state, action) => {
    state.activityLimitation = action.payload.activityLimitation
    state.disability = action.payload.disability
  })
)

export default icfReducer
