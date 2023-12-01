import { Dialog } from '@frontend/components'
import { IDSButton, IDSIconQuestion } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { Column } from '../Table/types/Column'

export function TableDescriptionDialog({ columns }: { columns: Column[] }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="pt-5 text-sm text-accent-40 underline print:hidden" onClick={() => setOpen(true)} type="button">
        <IDSIconQuestion size="s" className="inline-block pr-2 align-middle" />
        Beskrivning av tabellens rubriker
      </button>
      <Dialog dismissible open={open} headline="Beskrivning av tabellens rubriker">
        {columns
          .filter((column) => column.description && column.description?.length > 0)
          .map((column) => (
            <div key={column.name} className="pb-5">
              <h2 className="ids-heading-4">{column.name}</h2>
              <p>{column.description}</p>
            </div>
          ))}
        <IDSButton slot="action" sblock onClick={() => setOpen(false)}>
          Stäng
        </IDSButton>
      </Dialog>
    </>
  )
}
