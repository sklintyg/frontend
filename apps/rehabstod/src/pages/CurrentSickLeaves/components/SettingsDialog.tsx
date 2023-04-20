import { IDSButton, IDSDialog } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { SettingsDialogContent } from '../../../components/SettingsDialogContent/SettingsDialogContent'
import { useGetUserQuery } from '../../../store/api'

export function SettingsDialog() {
  const [showSettingsDialog, setShowSettingsDialog] = useState('false')
  const { data: user } = useGetUserQuery()

  return (
    <IDSDialog dismissible headline="Inställningar" show={showSettingsDialog}>
      <IDSButton trigger="" tertiary size="s" onClick={() => setShowSettingsDialog('true')}>
        Ändra
      </IDSButton>
      <SettingsDialogContent onClose={() => setShowSettingsDialog('false')} preferences={user ? user.preferences : undefined} />
    </IDSDialog>
  )
}
