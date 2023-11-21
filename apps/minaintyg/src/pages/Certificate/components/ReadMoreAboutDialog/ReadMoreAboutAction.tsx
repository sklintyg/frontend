import { useState } from 'react'
import { IDSButton, IDSDialogActions, IDSIconInformation } from '@frontend/ids-react-ts'
import { ReadMoreAboutDialog } from './ReadMoreAboutDialog'

export function ReadMoreAboutAction() {
  const [readMoreDialogOpen, showReadMoreDialog] = useState(false)
  return (
    <div>
      <button
        type="button"
        className="text-sky-base hover:text-sky-dark flex mt-4"
        onClick={() => showReadMoreDialog(true)}
        aria-label="Läs mer om vad du kan göra i Intyg"
      >
        <IDSIconInformation size={'s'} className="mr-2 inline mt-0.5" />
        Läs mer om vad du kan göra i Intyg
      </button>

      <ReadMoreAboutDialog open={readMoreDialogOpen} onOpenChange={showReadMoreDialog}>
        <IDSDialogActions>
          <IDSButton mblock onClick={() => showReadMoreDialog(false)} role="button">
            Stäng
          </IDSButton>
        </IDSDialogActions>
      </ReadMoreAboutDialog>
    </div>
  )
}
