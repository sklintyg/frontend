import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { isMatch } from 'lodash-es'
import type { RootState } from '../reducer'
import type { ApiCall } from './apiActions'

type ApiRequest = ApiCall & {
  id: string
}

const requestAdapter = createEntityAdapter<ApiRequest>()

const requestSlice = createSlice({
  name: 'requests',
  initialState: requestAdapter.getInitialState(),
  reducers: {
    addRequest: requestAdapter.addOne,
    removeRequest: requestAdapter.removeOne,
    updateRequest: requestAdapter.updateOne,
  },
})

export const { name: requestPath, reducer: requestReducer } = requestSlice
export const { addRequest, removeRequest, updateRequest } = requestSlice.actions

export const { selectAll: selectAllRequests } = requestAdapter.getSelectors<RootState>((state) => state.requests)

export const isFunctionDisabled = (disableGroup: string) => (state: RootState) =>
  Boolean(selectAllRequests(state).find((req) => req.functionDisablerType === disableGroup))

export const isRequestLoading = (payload: ApiCall) => (state: RootState) =>
  Boolean(
    selectAllRequests(state)
      .filter((req) => req.url === payload.url && req.method === payload.method)
      .find((req) => isMatch(req, payload))
  )
