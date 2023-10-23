import { Dialog } from '@frontend/components'
import { ComponentProps } from 'react'
import { useFormat } from '../../../../hooks/useFormat'
import { CertificateRecipient } from '../../../../schema/certificate.schema'

export function CertificateSentDialog({
  recipient,
  open,
  onOpenChange,
}: {
  recipient: CertificateRecipient
  open: boolean
  onOpenChange: ComponentProps<typeof Dialog>['onOpenChange']
}) {
  const { date } = useFormat()

  if (!recipient.sent) {
    return null
  }

  return (
    <Dialog open={open} dismissible headline="Intyget redan skickat" onOpenChange={onOpenChange}>
      Intyget har redan skickats och kan inte skickas igen. {recipient.name} tog emot intyget {date(recipient.sent)}.
    </Dialog>
  )
}
