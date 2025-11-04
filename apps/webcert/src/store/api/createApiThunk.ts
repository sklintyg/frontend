import { randomUUID } from '@frontend/utils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import store from '../store'
import { apiCallFailed } from './apiActions'
import { createApiError, getHeaders } from './apiUtils'
import { addRequest, isRequestLoading, removeRequest } from './requestSlice'

interface ApiCall {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: unknown
  headers?: Record<string, string>
}

export function createAsyncApiThunk<Response, ThunkArg = void>(name: string, init: (args: ThunkArg) => ApiCall) {
  return createAsyncThunk<Response, ThunkArg>(name, async (args, { rejectWithValue, dispatch }) => {
    const id = randomUUID()
    const { url, method, data, headers } = init(args)

    if (isRequestLoading({ url, method })(store.getState())) {
      return rejectWithValue(new Error('Request is already loading'))
    }

    try {
      dispatch(addRequest({ id, url, method }))
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
      const response = error instanceof AxiosError ? error.response : undefined

      dispatch(apiCallFailed(message))

      return rejectWithValue({ error: createApiError(`${method} ${url}`, response, message) })
    } finally {
      dispatch(removeRequest(id))
    }
  })
}
