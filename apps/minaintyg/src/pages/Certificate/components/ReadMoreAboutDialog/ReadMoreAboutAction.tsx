import { LinkIcon, TertiaryButton } from '@frontend/components'
import { IDSButton, IDSIconInformation } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { ReadMoreAboutDialog } from './ReadMoreAboutDialog'

export function ReadMoreAboutAction() {
  const [readMoreDialogOpen, showReadMoreDialog] = useState(false)
  return (
    <div>
      <TertiaryButton
        startIcon={<LinkIcon icon={IDSIconInformation} width="20" height="20" color="currentColor" />}
        onClick={() => showReadMoreDialog(true)}
        aria-label="Läs mer om vad du kan göra i Intyg"
      >
        Läs mer om vad du kan göra i Intyg
      </TertiaryButton>

      <ReadMoreAboutDialog open={readMoreDialogOpen} onOpenChange={showReadMoreDialog}>
        <IDSButton slot="action" mblock onClick={() => showReadMoreDialog(false)} role="button">
          Stäng
        </IDSButton>
      </ReadMoreAboutDialog>
    </div>
  )
}
