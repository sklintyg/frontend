import { Dialog } from '@frontend/components'
import { IDSButton } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { SjfItem } from '../../../../../schemas/patientSchema'

export function GetOpenInformationButton({ item, onClick }: { item: SjfItem; onClick: (id: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IDSButton
        role="button"
        onClick={() => {
          if (item.bidrarTillAktivtSjukfall) {
            onClick(item.itemId)
          } else {
            setOpen(!open)
          }
        }}
        tertiary
      >
        Hämta
      </IDSButton>
      <Dialog open={open} onOpenChange={setOpen} headline="Ingen information hämtad">
        <p>Vårdenhetens intyg tillhör inte pågående sjukfall och inhämtas därför inte.</p>
        <IDSButton slot="action" onClick={() => setOpen(false)}>
          Stäng
        </IDSButton>
      </Dialog>
    </>
  )
}
