import { LinkButton } from '@frontend/components'
import { IDSButton } from '@inera/ids-react'
import { usePrintCertificateContext } from './hooks/usePrintCertificate'

const label = 'Skriv ut'

export function PrintCertificateAction() {
  const { url, customizePrintFunction, showCustomizePrintDialog } = usePrintCertificateContext()

  return customizePrintFunction ? (
    <IDSButton secondary sBlock role="button" onClick={() => showCustomizePrintDialog('print')}>
      {label}
    </IDSButton>
  ) : (
    <LinkButton href={url} secondary sBlock type="application/pdf" target="_blank" rel="noreferrer">
      {label}
    </LinkButton>
  )
}
