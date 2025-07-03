import { Icon, TertiaryButton } from '@frontend/components'
import { IDSButton } from '@inera/ids-react'
import { useState } from 'react'
import { ReadMoreAboutDialog } from './ReadMoreAboutDialog'

export function ReadMoreAboutAction() {
  const [readMoreDialogOpen, showReadMoreDialog] = useState(false)
  return (
    <div>
      <TertiaryButton
        startIcon={<Icon icon="information" />}
        onClick={() => showReadMoreDialog(true)}
        aria-label="Läs mer om vad du kan göra i Intyg"
      >
        Läs mer om vad du kan göra i Intyg
      </TertiaryButton>

      <ReadMoreAboutDialog open={readMoreDialogOpen} onOpenChange={showReadMoreDialog}>
        <IDSButton mBlock onClick={() => showReadMoreDialog(false)} role="button">
          Stäng
        </IDSButton>
      </ReadMoreAboutDialog>
    </div>
  )
}
