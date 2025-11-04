import { randomUUID } from '@frontend/utils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import store from '../store'
import { apiCallFailed } from './apiActions'
import { addRequest, isRequestLoading, removeRequest } from './requestSlice'

export interface ApiError {
  api: string
  errorCode: string
  message: string
}

export interface ApiCall {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: unknown
  headers?: Record<string, string>
}

function getHeaders() {
  if (sessionStorage.getItem('launchId')) {
    return { launchId: sessionStorage.getItem('launchId') }
  }
  return {}
}

export function createAsyncApiThunk<Response, ThunkArg = void>(name: string, init: (args: ThunkArg) => ApiCall) {
  return createAsyncThunk<Response, ThunkArg>(name, async (args, { rejectWithValue, dispatch }) => {
    const id = randomUUID()
    const { url, method, data, headers } = init(args)

    if (isRequestLoading({ url, method })(store.getState())) {
      return rejectWithValue(new Error('Request already loading'))
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
      if (error instanceof Error && error.message != null) {
        dispatch(apiCallFailed(error.message))
      }
      return rejectWithValue(error)
    } finally {
      dispatch(removeRequest(id))
    }
  })
}
