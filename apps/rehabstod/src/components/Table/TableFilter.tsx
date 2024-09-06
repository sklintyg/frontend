import { TertiaryButton } from '@frontend/components'
import { IDSButton, IDSIconChevron } from '@frontend/ids-react-ts'
import type { ReactNode } from 'react'
import { useState } from 'react'

export function TableFilter({ onSearch, onReset, children }: { onSearch: () => void; onReset: () => void; children: ReactNode }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <>
      <h3 className="ids-heading-4 hidden print:block">Valda filter</h3>
      <TertiaryButton underlined onClick={() => setExpanded(!expanded)} className="py-2">
        <IDSIconChevron
          rotate={expanded ? '270' : '90'}
          width="0.75rem"
          height="0.75rem"
          color="currentColor"
          color2="currentColor"
          inline
        />
        <span className="px-2">{expanded ? 'Dölj sökfilter' : 'Visa sökfilter'}</span>
      </TertiaryButton>
      {expanded && (
        <div className="mb-5 print:mb-2">
          <div className="grid-cols-table-filter sm:grid-cols-table-filter-sm mb-7 grid gap-x-10 gap-y-7 print:mb-4 print:gap-2 print:sm:grid-cols-4">
            {children}
          </div>
          <div className="flex flex-col gap-5 print:hidden md:flex-row md:justify-end">
            <IDSButton mblock secondary onClick={onReset}>
              Återställ
            </IDSButton>
            <IDSButton mblock onClick={() => onSearch()}>
              Sök
            </IDSButton>
          </div>
        </div>
      )}
      <hr className="mb-5 opacity-40 print:hidden lg:mb-10" />
    </>
  )
}
