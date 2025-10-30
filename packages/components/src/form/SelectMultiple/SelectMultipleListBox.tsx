import type { ReactNode } from 'react'

export function SelectMultipleListBox({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div id={id} role="listbox" aria-multiselectable="true" className="flex flex-col gap-2">
      {children}
    </div>
  )
}
