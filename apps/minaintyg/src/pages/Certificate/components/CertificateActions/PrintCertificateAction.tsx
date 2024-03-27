import { LinkButton } from '@frontend/components'
import { IDSButton } from '@frontend/ids-react-ts'
import { usePrintCertificateContext } from './hooks/usePrintCertificate'

export function PrintCertificateAction() {
  const { url, customizePrintFunction, showCustomizePrintDialog } = usePrintCertificateContext()

  return (
    <div>
      {customizePrintFunction ? (
        <IDSButton secondary sblock role="button" onClick={() => showCustomizePrintDialog('print')}>
          Skriv ut
        </IDSButton>
      ) : (
        <LinkButton href={url} secondary type="application/pdf" target="_blank" rel="noreferrer">
          Skriv ut
        </LinkButton>
      )}
    </div>
  )
}
