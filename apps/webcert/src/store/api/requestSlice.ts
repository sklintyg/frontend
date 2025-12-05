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
export const { addRequest, removeRequest } = requestSlice.actions

export const { selectAll: selectAllRequests, selectById } = requestAdapter.getSelectors<RootState>((state) => state.requests)

export const isFunctionDisabled = (disableGroup: string) => (state: RootState) =>
  selectAllRequests(state).some(({ functionDisablerType }) => functionDisablerType === disableGroup)

export const isRequestLoading = (payload: Partial<ApiCall> & { url: string; method: string }) => (state: RootState) =>
  selectAllRequests(state).some((req) => isMatch(req, payload))
