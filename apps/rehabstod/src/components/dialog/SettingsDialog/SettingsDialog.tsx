import { IDSButton, IDSDialogActions } from '@frontend/ids-react-ts'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { DAYS_BETWEEN_SICK_LEAVES, DAYS_FINISHED_SICK_LEAVE } from '../../../schemas'
import { useGetUserQuery } from '../../../store/api'
import { useAppDispatch, useAppSelector, useUpdateUserPreferences } from '../../../store/hooks'
import { resetSettingsPreferences, updateSettingsPreferences, updateShowSettingsDialog } from '../../../store/slices/settings.slice'
import { Dialog } from '../Dialog'
import { DaysBetweenSickLeaves } from './DaysBetweenSickLeaves'
import { DaysFinishedSickLeave } from './DaysFinishedSickLeave'
import { SelectCareUnits } from './SelectCareUnits'

export function SettingsDialog() {
  const dispatch = useAppDispatch()
  const { preferences, showSettingsDialog } = useAppSelector((state) => state.settings)
  const { data: user } = useGetUserQuery()
  const { updateUserPreferences } = useUpdateUserPreferences()
  const [hasSaved, setHasSaved] = useState(false)

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
      dispatch(updateShowSettingsDialog(false))
      setHasSaved(true)
    }
  }

  useEffect(() => {
    if (!showSettingsDialog && !hasSaved) {
      dispatch(updateSettingsPreferences(user.preferences))
    }
    setHasSaved(false)
  }, [showSettingsDialog, dispatch])

  useEffect(() => {
    if (user) {
      dispatch(updateSettingsPreferences(user.preferences))
    }
    return () => {
      dispatch(resetSettingsPreferences())
    }
  }, [dispatch, user])

  if (!user) {
    return null
  }

  return (
    <Dialog
      open={showSettingsDialog}
      onOpenChange={(open) => dispatch(updateShowSettingsDialog(open))}
      dismissible
      headline="Inställningar"
    >
      <DaysFinishedSickLeave
        value={preferences.maxAntalDagarSedanSjukfallAvslut}
        onChange={(val) => {
          dispatch(updateSettingsPreferences({ maxAntalDagarSedanSjukfallAvslut: val || undefined }))
        }}
      />
      <DaysBetweenSickLeaves
        value={preferences.maxAntalDagarMellanIntyg}
        onChange={(val) => dispatch(updateSettingsPreferences({ maxAntalDagarMellanIntyg: val || undefined }))}
      />
      <SelectCareUnits
        standardenhet={preferences.standardenhet}
        onChange={(value) => dispatch(updateSettingsPreferences({ standardenhet: value !== 'Ingen förvald enhet' ? value : null }))}
      />
      <IDSDialogActions>
        <IDSButton secondary onClick={() => dispatch(updateShowSettingsDialog(false))}>
          Avbryt
        </IDSButton>
        <IDSButton onClick={onSave} disabled={!isSaveEnabled}>
          Spara
        </IDSButton>
      </IDSDialogActions>
    </Dialog>
  )
}
