import { IDSButton, IDSDialog, IDSDialogActions, IDSDialogElement, IDSIconQuestion } from '@frontend/ids-react-ts'
import { useRef } from 'react'
import { Column } from '../Table/types/Column'

export function TableDescriptionDialog({ columns }: { columns: Column[] }) {
  const ref = useRef<IDSDialogElement>(null)
  const close = () => ref.current?.hideDialog()

  return (
    <IDSDialog ref={ref} dismissible headline="Beskrivning av tabellens rubriker">
      <button className="pt-5 text-sm text-accent-40 underline print:hidden" trigger="" type="button">
        <IDSIconQuestion size="s" className="inline-block pr-2 align-middle" />
        Beskrivning av tabellens rubriker
      </button>
      {columns
        .filter((column) => column.description && column.description?.length > 0)
        .map((column) => (
          <div key={column.name} className="pb-5">
            <h3 className="ids-heading-4">{column.name}</h3>
            <p>{column.description}</p>
          </div>
        ))}
      <IDSDialogActions>
        <IDSButton sblock onClick={close}>
          Stäng
        </IDSButton>
      </IDSDialogActions>
    </IDSDialog>
  )
}
