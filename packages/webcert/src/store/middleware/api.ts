import * as actions from '../api'
import { Middleware, MiddlewareAPI, Dispatch } from 'redux'
import axios from 'axios'
import { apiCallBegan } from '../api'
import { AnyAction } from '@reduxjs/toolkit'

const api: Middleware = ({ dispatch }: MiddlewareAPI) => (next: Dispatch) => async (action: AnyAction) => {
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
      baseURL: 'http://localhost:5000',
      url,
      method,
      data,
    })

    dispatch(actions.apiCallSuccess(response.data))

    if (onSuccess) {
      dispatch(onSuccess(response.data))
    }
  } catch (error) {
    dispatch(actions.apiCallFailed(error.message))

    if (onError) {
      dispatch(onError())
    }
  }
}

export default api
