import { randomUUID } from '@frontend/utils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios, { isAxiosError } from 'axios'
import type { RootState } from '../reducer'
import { apiCallFailed } from './apiActions'
import { createApiError, getHeaders } from './apiUtils'
import { addRequest, isRequestLoading, removeRequest } from './requestSlice'

interface ApiCall {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: unknown
  headers?: Record<string, string>
  functionDisablerType?: string
}

export function createAsyncApiThunk<Response, ThunkArg = void>(name: string, init: (args: ThunkArg) => ApiCall) {
  return createAsyncThunk<Response, ThunkArg, { state: RootState }>(name, async (args, { rejectWithValue, dispatch, getState }) => {
    const id = randomUUID()
    const { url, method, headers, data, functionDisablerType } = init(args)

    if (isRequestLoading({ url, method, headers, data })(getState())) {
      return rejectWithValue('Request is already loading')
    }

    try {
      dispatch(addRequest({ id, url, method, headers, data, functionDisablerType }))
      const response = await axios.request<Response>({
        url,
        method,
        data,
        withCredentials: true,
        headers: { ...getHeaders(), ...headers },
      })

      return response.data
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      const response = isAxiosError(error) ? error.response : undefined

      dispatch(apiCallFailed(message))

      return rejectWithValue({ error: createApiError(`${method} ${url}`, response, message) })
    } finally {
      dispatch(removeRequest(id))
    }
  })
}
