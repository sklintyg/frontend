import { Button, Dialog, Heading } from '@frontend/components'
import { IDSIconInformation } from '@inera/ids-react'
import { useState } from 'react'
import type { Column } from '../Table/types/Column'

export function TableDescriptionDialog({ columns }: { columns: Column[] }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="pt-5 text-sm text-accent-40 underline print:hidden" onClick={() => setOpen(true)} type="button">
        <IDSIconInformation size="s" className="inline-block pr-2 align-middle" />
        Beskrivning av tabellens rubriker
      </button>
      <Dialog dismissible open={open} onOpenChange={setOpen} headline="Beskrivning av tabellens rubriker">
        {columns
          .filter((column) => column.description && column.description?.length > 0)
          .map((column) => (
            <div key={column.name} className="pb-5">
              <Heading level={2} size="xs">
                {column.name}
              </Heading>
              <p>{column.description}</p>
            </div>
          ))}
        <div slot="actions">
          <Button sBlock onClick={() => setOpen(false)}>
            Stäng
          </Button>
        </div>
      </Dialog>
    </>
  )
}
