import isEqual from 'lodash/isEqual'
import { useRef } from 'react'
import { UserPreferences } from '../../schemas'
import { api, useGetUserQuery } from '../api'
import { useAppDispatch } from '.'

/**
 * Custom hook for updating user preferences and invalidating necessary states
 */
export function useUpdateUserPreferences() {
  const dispatch = useAppDispatch()
  const { data: user } = useGetUserQuery()
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
