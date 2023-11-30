import { IDSButton, IDSIconChevron } from '@frontend/ids-react-ts'
import { ReactNode, useState } from 'react'

export function TableFilter({ onSearch, onReset, children }: { onSearch: () => void; onReset: () => void; children: ReactNode }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <>
      <h3 className="ids-heading-4 hidden print:block">Valda filter</h3>
      <IDSButton tertiary size="s" onClick={() => setExpanded(!expanded)} className="my-4 print:hidden">
        <IDSIconChevron rotate={expanded ? '270' : '90'} width="0.75rem" height="0.75rem" inline />
        {expanded ? 'Dölj sökfilter' : 'Visa sökfilter'}
      </IDSButton>
      {expanded && (
        <div className="mb-5 print:mb-2">
          <div className="mb-7 grid grid-cols-table-filter gap-x-10 gap-y-7 print:mb-4 print:gap-2 sm:grid-cols-table-filter-sm print:sm:grid-cols-4">
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
