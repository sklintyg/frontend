import { Button, Heading } from '@frontend/components'
import { IDSIconChevron } from '@inera/ids-react'
import type { ReactNode } from 'react'
import { useState } from 'react'

export function TableFilter({ onSearch, onReset, children }: { onSearch: () => void; onReset: () => void; children: ReactNode }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <>
      <Heading level={3} size="xs" className="hidden print:block">
        Valda filter
      </Heading>
      <div className="py-2 print:hidden">
        <Button tertiary onClick={() => setExpanded(!expanded)} className="flex py-2 align-middle">
          <IDSIconChevron rotate={expanded ? '270' : '90'} width="0.75rem" height="0.75rem" color="currentColor" inline />
          <span className="font-bold">{expanded ? 'Dölj sökfilter' : 'Visa sökfilter'}</span>
        </Button>
      </div>

      {expanded && (
        <div className="mb-5 print:mb-2">
          <div className="mb-7 grid grid-cols-table-filter gap-x-10 gap-y-7 print:mb-4 print:gap-2 sm:grid-cols-table-filter-sm print:sm:grid-cols-4">
            {children}
          </div>
          <div className="flex flex-col gap-5 print:hidden md:flex-row md:justify-end">
            <Button mBlock secondary onClick={onReset}>
              Återställ
            </Button>
            <Button mBlock onClick={() => onSearch()}>
              Sök
            </Button>
          </div>
        </div>
      )}
      <hr className="mb-5 opacity-40 print:hidden lg:mb-10" />
    </>
  )
}
