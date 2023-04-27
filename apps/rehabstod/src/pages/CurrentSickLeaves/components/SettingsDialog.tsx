import { IDSButton, IDSDialog } from '@frontend/ids-react-ts'
import { useEffect, useRef, useState } from 'react'
import { IDSDialogElement } from '@frontend/ids-react-ts/src'
import { SettingsDialogContent } from '../../../components/SettingsDialog/SettingsDialogContent'
import { useGetUserQuery } from '../../../store/api'
import { UserPreferences } from '../../../schemas'

export function SettingsDialog() {
  const { data: user } = useGetUserQuery()
  const ref = useRef<IDSDialogElement>(null)
  const [savedPreferences, setSavedPreferences] = useState<UserPreferences | undefined>(user ? user.preferences : undefined)

  useEffect(() => {
    if (ref.current) {
      if (user) {
        ref.current.addEventListener('changedVisibility', () => setSavedPreferences(user.preferences))
      }
    }
  }, [ref, user])

  if (!user || !user.preferences || !savedPreferences) {
    return null
  }

  return (
    <IDSDialog dismissible headline="Inställningar" ref={ref}>
      <IDSButton trigger="" tertiary size="s" onClick={() => ref.current?.showDialog()}>
        Ändra
      </IDSButton>
      <SettingsDialogContent
        onChange={(preferences) => setSavedPreferences(preferences)}
        onClose={() => ref.current?.hideDialog()}
        preferences={savedPreferences}
      />
    </IDSDialog>
  )
}
