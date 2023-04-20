import { IDSButton, IDSDialog } from '@frontend/ids-react-ts'
import { IDSDialog as IDSDialogElement } from '@inera/ids-core/components/dialog/dialog-element'
import { useRef } from 'react'
import { SettingsDialogContent } from '../../../components/SettingsDialogContent/SettingsDialogContent'
import { useGetUserQuery } from '../../../store/api'

export function SettingsDialog() {
  const { data: user } = useGetUserQuery()
  const ref = useRef<IDSDialogElement>(null)

  return (
    <IDSDialog dismissible headline="Inställningar" ref={ref}>
      <IDSButton trigger="" tertiary size="s" onClick={() => ref.current?.showDialog()}>
        Ändra
      </IDSButton>
      <SettingsDialogContent onClose={() => ref.current?.hideDialog()} preferences={user ? user.preferences : undefined} />
    </IDSDialog>
  )
}
