/* eslint-disable import/no-extraneous-dependencies */
import { AnyAction, combineReducers, configureStore, createSlice } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createMemoryHistory } from 'history'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { certificateMiddleware } from '../store/certificate/certificateMiddleware'
import { errorMiddleware } from '../store/error/errorMiddleware'
import { fmbMiddleware } from '../store/fmb/fmbMiddleware'
import { icfMiddleware } from '../store/icf/icfMiddleware'
import { listMiddleware } from '../store/list/listMiddleware'
import { patientMiddleware } from '../store/patient/patientMiddleware'
import { questionMiddleware } from '../store/question/questionMiddleware'
import { sessionMiddleware } from '../store/session/sessionMiddleware'
import { srsMiddleware } from '../store/srs/srsMiddleware'
import uiReducers from '../store/uiReducers'
import { userMiddleware } from '../store/user/userMiddleware'
import { utilsMiddleware } from '../store/utils/utilsMiddleware'
import { welcomeMiddleware } from '../store/welcome/welcomeMiddleware'

export const history = createMemoryHistory()

const actionSlice = createSlice({
  name: 'action',
  initialState: [] as AnyAction[],
  reducers: { clearActions: () => [] },
  extraReducers: (builder) => {
    builder.addDefaultCase((state, action) => {
      return [...state, action]
    })
  },
})

function getStore() {
  return configureStore({
    reducer: combineReducers({
      router: connectRouter(history),
      ui: uiReducers,
      actions: actionSlice.reducer,
    }),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(
          certificateMiddleware,
          userMiddleware,
          fmbMiddleware,
          utilsMiddleware,
          welcomeMiddleware,
          questionMiddleware,
          icfMiddleware,
          sessionMiddleware,
          errorMiddleware,
          patientMiddleware,
          listMiddleware,
          srsMiddleware
        )
        .prepend(routerMiddleware(history)),
  })
}

export function renderWithStore(
  node: ReactNode
): ReturnType<typeof render> & { store: ReturnType<typeof getStore>; getCalledActions: () => AnyAction[]; clearCalledActions: () => void } {
  const store = getStore()

  function getCalledActions(): AnyAction[] {
    return store.getState().actions
  }

  function clearCalledActions() {
    store.dispatch(actionSlice.actions.clearActions())
  }

  return {
    getCalledActions,
    clearCalledActions,
    store,
    ...render(
      <Provider store={store}>
        <Router history={history}>{node}</Router>
      </Provider>
    ),
  }
}
