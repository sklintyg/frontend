import { IDSButton, IDSIconInformation } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { ReadMoreAboutDialog } from './ReadMoreAboutDialog'

export function ReadMoreAboutAction() {
  const [readMoreDialogOpen, showReadMoreDialog] = useState(false)
  return (
    <div>
      <button
        type="button"
        className="mt-4 flex text-sky-base hover:text-sky-dark"
        onClick={() => showReadMoreDialog(true)}
        aria-label="Läs mer om vad du kan göra i Intyg"
      >
        <IDSIconInformation size="s" className="mr-2 mt-0.5 inline" />
        Läs mer om vad du kan göra i Intyg
      </button>

      <ReadMoreAboutDialog open={readMoreDialogOpen} onOpenChange={showReadMoreDialog}>
        <IDSButton slot="action" mblock onClick={() => showReadMoreDialog(false)} role="button">
          Stäng
        </IDSButton>
      </ReadMoreAboutDialog>
    </div>
  )
}
