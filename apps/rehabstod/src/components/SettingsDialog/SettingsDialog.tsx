import { IDSButton, IDSDialog, IDSDialogActions } from '@frontend/ids-react-ts'
import { IDSDialogElement } from '@frontend/ids-react-ts/src'
import { useEffect, useRef } from 'react'
import { userPreferencesSchema } from '../../schemas'
import { useGetUserQuery, useUpdateUserPreferencesMutation } from '../../store/api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { hideSettingsDialog, resetSettings, showSettingsDialog, updateSettings } from '../../store/slices/settings.slice'
import { DaysBetweenSickLeaves } from './DaysBetweenSickLeaves'
import { DaysFinishedSickLeave } from './DaysFinishedSickLeave'
import { SelectCareUnits } from './SelectCareUnits'

export function SettingsDialog({ onVisibilityChanged }: { onVisibilityChanged?: (visible: boolean) => void }) {
  const dispatch = useAppDispatch()
  const { preferences, showDialog } = useAppSelector((state) => state.settings)
  const { data: user } = useGetUserQuery()
  const ref = useRef<IDSDialogElement>(null)
  const [updateUserPreferences] = useUpdateUserPreferencesMutation()
  const close = () => ref.current?.hideDialog()

  const isMaxAntalDagarMellanIntygValid = userPreferencesSchema.shape.maxAntalDagarMellanIntyg.safeParse(
    preferences.maxAntalDagarMellanIntyg
  ).success
  const isMaxAntalDagarSedanSjukfallAvslutValid = userPreferencesSchema.shape.maxAntalDagarSedanSjukfallAvslut.safeParse(
    preferences.maxAntalDagarSedanSjukfallAvslut
  ).success

  const isSaveEnabled = isMaxAntalDagarSedanSjukfallAvslutValid && isMaxAntalDagarMellanIntygValid

  const onSave = () => {
    if (preferences) {
      updateUserPreferences(preferences)
      close()
    }
  }

  useEffect(() => {
    if (user) {
      dispatch(updateSettings(user.preferences))
    }
    return () => {
      dispatch(resetSettings())
    }
  }, [dispatch, user])

  useEffect(() => {
    const dialogEl = ref.current
    const isShown = (dialogEl?.show ?? 'false') !== 'false'

    function handleVisibilityChanged() {
      if (showDialog && dialogEl?.show === 'false') {
        dispatch(hideSettingsDialog())
      }
      if (!showDialog && dialogEl?.show === 'true') {
        dispatch(showSettingsDialog())
      }
      if (onVisibilityChanged) {
        onVisibilityChanged(dialogEl?.show === 'true')
      }
    }

    if (dialogEl) {
      if (showDialog === true && !isShown) {
        dialogEl.showDialog()
      }
      if (showDialog === false && isShown) {
        dialogEl.hideDialog()
      }
    }

    dialogEl?.addEventListener('changedVisibility', handleVisibilityChanged)
    return () => dialogEl?.removeEventListener('changedVisibility', handleVisibilityChanged)
  }, [dispatch, onVisibilityChanged, showDialog])

  if (!user) {
    return null
  }

  return (
    <IDSDialog dismissible headline="Inställningar" ref={ref}>
      {preferences.maxAntalDagarSedanSjukfallAvslut && (
        <DaysFinishedSickLeave
          value={parseInt(preferences.maxAntalDagarSedanSjukfallAvslut, 10)}
          onChange={(value) => dispatch(updateSettings({ maxAntalDagarSedanSjukfallAvslut: value.toString() }))}
        />
      )}
      {preferences.maxAntalDagarMellanIntyg && (
        <DaysBetweenSickLeaves
          value={parseInt(preferences.maxAntalDagarMellanIntyg, 10)}
          onChange={(value) => dispatch(updateSettings({ maxAntalDagarMellanIntyg: value.toString() }))}
        />
      )}
      <SelectCareUnits
        standardenhet={preferences.standardenhet}
        onChange={(value) => dispatch(updateSettings({ standardenhet: value !== 'Ingen förvald enhet' ? value : null }))}
      />
      <IDSDialogActions>
        <IDSButton secondary onClick={close}>
          Avbryt
        </IDSButton>
        <IDSButton onClick={onSave} disabled={!isSaveEnabled}>
          Spara
        </IDSButton>
      </IDSDialogActions>
    </IDSDialog>
  )
}
