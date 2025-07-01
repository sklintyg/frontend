import { Dialog, LinkButton, Radio } from '@frontend/components'
import { IDSButton, IDSRadioGroup } from '@inera/ids-react'
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
        <IDSRadioGroup>
          {customizePrintFunction.information
            .filter((info) => info.type === InformationTypeEnum.enum.OPTIONS)
            .map(({ id, text }) => (
              <Radio
                key={text}
                label={text}
                value={id || ''}
                name="option"
                checked={customizeId === (id || '')}
                onChange={(event) => setCustomizeId(event.target.value)}
              />
            ))}
        </IDSRadioGroup>
        {customizeId === '!diagnoser' && <p className="mb-5">{customizePrintFunction.description}</p>}
      </div>
      {customizePrintDialogOpen && (
        <>
          <IDSButton slot="action" mblock onClick={hideCustomizePrintDialog} role="button" secondary>
            Avbryt
          </IDSButton>
          {}
          {customizePrintType === 'print' && (
            <LinkButton
              slot="action"
              mblock
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
              mblock
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
