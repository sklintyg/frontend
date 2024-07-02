import type { AvailableFunctionsType } from '../schema/certificate.schema'
import { api } from './api'
import type { RootState } from './reducer'

export function getAvailableFunctions(id: string) {
  return (state: RootState) => api.endpoints.getCertificate.select({ id })(state).data?.availableFunctions
}

export function getAvailableFunction(id: string, type: AvailableFunctionsType) {
  return (state: RootState) => (getAvailableFunctions(id)(state) ?? []).find((fn) => fn.type === type)
}
