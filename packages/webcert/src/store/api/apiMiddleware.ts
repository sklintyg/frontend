import { Middleware, MiddlewareAPI, Dispatch } from 'redux'
import axios from 'axios'
import { apiCallBegan, apiCallFailed, apiCallSuccess } from './apiActions'
import { AnyAction } from '@reduxjs/toolkit'

const apiMiddleware: Middleware = ({ dispatch }: MiddlewareAPI) => (next: Dispatch) => async (action: AnyAction) => {
  if (!apiCallBegan.match(action)) {
    return next(action)
  }

  const { url, method, data, onStart, onSuccess, onError } = action.payload

  if (onStart) {
    dispatch(onStart())
  }

  next(action)

  try {
    const response = await axios.request({
      baseURL: 'http://localhost:3000',
      url,
      method,
      data,
      withCredentials: true,
    })

    dispatch(apiCallSuccess(response.data))

    if (onSuccess) {
      dispatch(onSuccess(response.data))
    }
  } catch (error) {
    dispatch(apiCallFailed(error.message))

    if (onError) {
      dispatch(onError())
    }
  }
}

export default apiMiddleware
