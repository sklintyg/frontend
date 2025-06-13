import { useState } from 'react'
import { Button } from '../../../../../components/Button/Button'
import { Dialog } from '../../../../../components/dialog/Dialog'
import type { SjfItem } from '../../../../../schemas/patientSchema'

export function GetOpenInformationButton({ item, onClick }: { item: SjfItem; onClick: (id: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        role="button"
        tertiary
        onClick={() => {
          if (item.bidrarTillAktivtSjukfall) {
            onClick(item.itemId)
          } else {
            setOpen(!open)
          }
        }}
      >
        Hämta
      </Button>
      <Dialog open={open} onOpenChange={setOpen} headline="Ingen information hämtad">
        <p>Vårdenhetens intyg tillhör inte pågående sjukfall och inhämtas därför inte.</p>
        <Button slot="action" onClick={() => setOpen(false)}>
          Stäng
        </Button>
      </Dialog>
    </>
  )
}
