import * as actions from '../api'
import { Middleware, MiddlewareAPI, Dispatch } from 'redux'
import axios from 'axios'

const api: Middleware = ({ getState, dispatch }: MiddlewareAPI) => (next: Dispatch) => async (action) => {
  if (action.type !== actions.apiCallBegan.type) return next(action)

  const { url, method, data, onStart, onSuccess, onError } = action.payload

  if (onStart) dispatch({ type: onStart })

  next(action)

  try {
    const response = await axios.request({
      baseURL: 'http://localhost:5000',
      url,
      method,
      data,
    })

    // General
    dispatch(actions.apiCallSuccess(response.data))
    // Specific
    if (onSuccess) dispatch({ type: onSuccess, payload: response.data })
  } catch (error) {
    // General
    dispatch(actions.apiCallFailed(error.message))
    // Specific
    if (onError) dispatch({ type: onError, payload: error.message })
  }
}

export default api
