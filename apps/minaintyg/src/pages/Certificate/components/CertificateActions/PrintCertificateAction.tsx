import { LinkButton } from '@frontend/components'
import { IDSButton } from '@frontend/ids-react-ts'
import { usePrintCertificateContext } from './hooks/usePrintCertificate'

const label = 'Skriv ut'

export function PrintCertificateAction() {
  const { url, customizePrintFunction, showCustomizePrintDialog } = usePrintCertificateContext()

  return customizePrintFunction ? (
    <IDSButton secondary sblock role="button" onClick={() => showCustomizePrintDialog('print')}>
      {label}
    </IDSButton>
  ) : (
    <LinkButton href={url} secondary sblock type="application/pdf" target="_blank" rel="noreferrer">
      {label}
    </LinkButton>
  )
}
