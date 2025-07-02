import { Dialog, LinkButton } from '@frontend/components'
import { IDSButton, IDSRadio, IDSRadioGroup } from '@inera/ids-react'
import { InformationTypeEnum } from '../../../../../schema/certificate.schema'
import { usePrintCertificateContext } from '../hooks/usePrintCertificate'

export function CustomizePrintDialog() {
  const {
    url,
    customizePrintFunction,
    customizePrintDialogOpen,
    hideCustomizePrintDialog,
    customizeId,
    setCustomizeId,
    customizePrintType,
    setSaveWarningDialogOpen,
  } = usePrintCertificateContext()

  if (!customizePrintFunction) {
    return null
  }

  return (
    <Dialog
      open={customizePrintDialogOpen}
      onOpenChange={(open) => !open && hideCustomizePrintDialog()}
      headline={customizePrintFunction.title ?? ''}
    >
      <div className="max-w-3xl">
        <p className="mb-5">{customizePrintFunction.body}</p>
        <IDSRadioGroup name="customize-print-options">
          {customizePrintFunction.information
            .filter((info) => info.type === InformationTypeEnum.enum.OPTIONS)
            .map(({ id, text }) => (
              <IDSRadio
                key={text}
                value={id || ''}
                name="option"
                checked={customizeId === (id || '')}
                onChange={(event) => setCustomizeId(event.target.value)}
              >
                {text}
              </IDSRadio>
            ))}
        </IDSRadioGroup>
        {customizeId === '!diagnoser' && <p className="mb-5">{customizePrintFunction.description}</p>}
      </div>
      {customizePrintDialogOpen && (
        <>
          <IDSButton slot="action" mBlock onClick={hideCustomizePrintDialog} role="button" secondary>
            Avbryt
          </IDSButton>
          {}
          {customizePrintType === 'print' && (
            <LinkButton
              slot="action"
              mBlock
              href={url}
              type="application/pdf"
              target="_blank"
              rel="noreferrer"
              onClick={hideCustomizePrintDialog}
            >
              Skriv ut
            </LinkButton>
          )}
          {customizePrintType === 'save' && (
            <IDSButton
              secondary
              mBlock
              slot="action"
              role="button"
              onClick={() => {
                hideCustomizePrintDialog()
                setSaveWarningDialogOpen(true)
              }}
            >
              Spara
            </IDSButton>
          )}
        </>
      )}
    </Dialog>
  )
}
