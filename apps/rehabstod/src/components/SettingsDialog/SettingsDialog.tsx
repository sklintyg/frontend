import { IDSButton, IDSDialog, IDSDialogActions } from '@frontend/ids-react-ts'
import { IDSDialogElement } from '@frontend/ids-react-ts/src'
import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { DAYS_BETWEEN_SICK_LEAVES, DAYS_FINISHED_SICK_LEAVE } from '../../schemas'
import { useGetUserQuery } from '../../store/api'
import { useAppDispatch, useAppSelector, useUpdateUserPreferences } from '../../store/hooks'
import { hideSettingsDialog, resetSettings, showSettingsDialog, updateSettings } from '../../store/slices/settings.slice'
import { DaysBetweenSickLeaves } from './DaysBetweenSickLeaves'
import { DaysFinishedSickLeave } from './DaysFinishedSickLeave'
import { SelectCareUnits } from './SelectCareUnits'

export function SettingsDialog({ onVisibilityChanged }: { onVisibilityChanged?: (visible: boolean) => void }) {
  const dispatch = useAppDispatch()
  const { preferences, showDialog } = useAppSelector((state) => state.settings)
  const { data: user } = useGetUserQuery()
  const ref = useRef<IDSDialogElement>(null)
  const { updateUserPreferences } = useUpdateUserPreferences()
  const close = () => ref.current?.hideDialog()

  const isMaxAntalDagarMellanIntygValid = z.coerce
    .number()
    .max(DAYS_BETWEEN_SICK_LEAVES.MAX)
    .min(DAYS_BETWEEN_SICK_LEAVES.MIN)
    .safeParse(preferences.maxAntalDagarMellanIntyg)
  const isMaxAntalDagarSedanSjukfallAvslutValid = z.coerce
    .number()
    .max(DAYS_FINISHED_SICK_LEAVE.MAX)
    .min(DAYS_FINISHED_SICK_LEAVE.MIN)
    .safeParse(preferences.maxAntalDagarSedanSjukfallAvslut)

  const isSaveEnabled = isMaxAntalDagarSedanSjukfallAvslutValid.success && isMaxAntalDagarMellanIntygValid.success

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
      dispatch(updateSettings(user?.preferences ?? {}))
      if (showDialog && dialogEl?.show === 'false') {
        dispatch(hideSettingsDialog())
      }
      if (!showDialog && dialogEl?.show === 'true') {
        dispatch(showSettingsDialog())
      }
      if (onVisibilityChanged) {
        onVisibilityChanged(dialogEl?.show === 'true')
      }
      if (dialogEl?.show === 'true') {
        dialogEl?.querySelector('input')?.focus()
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
  }, [dispatch, onVisibilityChanged, showDialog, user?.preferences])

  if (!user) {
    return null
  }

  return (
    <IDSDialog dismissible headline="Inställningar" ref={ref}>
      <div className="max-h-[calc(100vh-6rem)] overflow-y-scroll">
        <DaysFinishedSickLeave
          value={preferences.maxAntalDagarSedanSjukfallAvslut}
          onChange={(val) => {
            dispatch(updateSettings({ maxAntalDagarSedanSjukfallAvslut: val || undefined }))
          }}
        />
        <DaysBetweenSickLeaves
          value={preferences.maxAntalDagarMellanIntyg}
          onChange={(val) => dispatch(updateSettings({ maxAntalDagarMellanIntyg: val || undefined }))}
        />
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
      </div>
    </IDSDialog>
  )
}
