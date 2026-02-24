import type { AnyAction } from '@reduxjs/toolkit'
import type { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { randomUUID } from '@frontend/utils'
import { api } from '../api'
import { ErrorCode } from '../error/errorReducer'
import type { IdpConnectivity } from './monitoringReducer'
import { MonitoringRequestEvent } from './monitoringReducer'
import { getUserSuccess } from '../user/userActions'
import type { RootState } from '../reducer'

export function resetIdpConnectivityCheck(): void {
  hasChecked = false
}

let hasChecked = false

const STORAGE_KEY = 'last-idp-connectivity-check-date'
const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000

function canReachUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve(true)
    image.onerror = () => resolve(false)
    image.src = `${url}${Date.now()}`
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function performIdpConnectivityCheck(dispatch: (action: any) => any, idpConnectUrls: string[]): Promise<void> {
  try {
    if (globalThis.localStorage) {
      const checkTimestamp = globalThis.localStorage.getItem(STORAGE_KEY)
      if (checkTimestamp !== null && Date.now() - Date.parse(checkTimestamp) < CHECK_INTERVAL_MS) {
        return
      }
    }

    const ipResponse = await fetch('https://api.ipify.org')
    const clientIp = await ipResponse.text()
    const connectivity: IdpConnectivity[] = []

    await Promise.all(
      idpConnectUrls.map(async (url) => {
        const connected = await canReachUrl(url)
        const check: IdpConnectivity = { url, connected: connected }
        connectivity.push(check)
      })
    )

    dispatch(
      api.endpoints.logMonitoring.initiate({
        info: { ip: clientIp, connectivity: JSON.stringify(connectivity) },
        event: MonitoringRequestEvent.IDP_CONNECTIVITY_CHECK,
      })
    )

    if (globalThis.localStorage) {
      globalThis.localStorage.setItem(STORAGE_KEY, new Date().toString())
    }
  } catch {
    dispatch(
      api.endpoints.logError.initiate({
        errorId: randomUUID(),
        errorCode: ErrorCode.IDP_CONNECTIVITY_CHECK,
        message: 'IDP connectivity check failed while verifying endpoints.',
      })
    )
  }
}

export const idpConnectivityMiddleware: Middleware<Dispatch> =
  ({ dispatch, getState }: MiddlewareAPI) =>
  (next) =>
  (action: AnyAction): void => {
    next(action)
    if (action.type === getUserSuccess.type && !hasChecked && action.payload?.user?.loggedInUnit?.unitId) {
      const state = getState() as RootState
      const idpConnectUrls = state.ui.uiUtils.config.idpConnectUrls

      if (idpConnectUrls.length > 0) {
        hasChecked = true
        performIdpConnectivityCheck(dispatch, idpConnectUrls)
      }
    }
  }
