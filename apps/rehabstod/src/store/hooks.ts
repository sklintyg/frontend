import isEqual from 'lodash/isEqual'
import { useRef } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { UserPreferences } from '../schemas'
import { api } from './api'
import { AppDispatch, RootState } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

/**
 * Custom hook for updating user preferences and invalidating necessary states
 */
export function useUpdateUserPreferences() {
  const dispatch = useAppDispatch()
  const { data: user } = api.useGetUserQuery()
  const [update, { isLoading, ...status }] = api.useUpdateUserPreferencesMutation()
  const lastPayload = useRef<Partial<UserPreferences>>({})

  const updateUserPreferences = (preferences: Partial<UserPreferences>) => {
    if (user) {
      if (!isEqual(lastPayload.current, preferences)) {
        const request = update({ ...user.preferences, ...preferences })
        request
          .then((data) => {
            if (
              Object.keys(preferences).some((key) =>
                ['maxAntalDagarSedanSjukfallAvslut', 'standardenhet', 'maxAntalDagarMellanIntyg'].includes(key)
              )
            ) {
              dispatch(api.util.invalidateTags(['SickLeaves', 'Patient']))
            }
            return data
          })
          .catch(() => dispatch(api.util.invalidateTags(['User'])))
        lastPayload.current = preferences
      }
    }
  }
  return { updateUserPreferences, ...{ isLoading, ...status } }
}
