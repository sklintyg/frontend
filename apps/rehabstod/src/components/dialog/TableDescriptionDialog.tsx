import { Button, Dialog, Heading, Icon } from '@frontend/components'
import { useState } from 'react'
import type { Column } from '../Table/types/Column'
import { TertiaryButton } from '../TertiaryButton/TertiaryButton'

export function TableDescriptionDialog({ columns }: { columns: Column[] }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <TertiaryButton className="pt-5 print:hidden" onClick={() => setOpen(true)} startIcon={<Icon icon="information" size="m" />}>
        Beskrivning av tabellens rubriker
      </TertiaryButton>
      <Dialog
        dismissible
        open={open}
        onOpenChange={setOpen}
        headline="Beskrivning av tabellens rubriker"
        actions={
          <Button sBlock onClick={() => setOpen(false)}>
            Stäng
          </Button>
        }
      >
        {columns
          .filter((column) => column.description && column.description?.length > 0)
          .map((column) => (
            <div key={column.name} className="pb-5">
              <Heading level={2} size="xs">
                {column.name}
              </Heading>
              <p className="text-on-background">{column.description}</p>
            </div>
          ))}
      </Dialog>
    </>
  )
}
