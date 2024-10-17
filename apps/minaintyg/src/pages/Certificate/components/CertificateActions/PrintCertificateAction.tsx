import { LinkButton } from 'components'
import { IDSButton } from 'ids-react-ts'
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
