import { IDSIconChevron } from '@inera/ids-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Button } from '../Button/Button'
import { Heading } from '../Heading/Heading'
import { TertiaryButton } from '../TertiaryButton/TertiaryButton'

export function TableFilter({ onSearch, onReset, children }: { onSearch: () => void; onReset: () => void; children: ReactNode }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <>
      <Heading level={3} size="xs" className="hidden print:block">
        Valda filter
      </Heading>
      <TertiaryButton
        onClick={() => setExpanded(!expanded)}
        className="flex py-2 align-middle"
        startIcon={<IDSIconChevron rotate={expanded ? '270' : '90'} width="0.75rem" height="0.75rem" color="currentColor" inline />}
      >
        <span className="font-bold">{expanded ? 'Dölj sökfilter' : 'Visa sökfilter'}</span>
      </TertiaryButton>
      {expanded && (
        <div className="mb-5 print:mb-2">
          <div className="mb-7 grid grid-cols-table-filter gap-x-10 gap-y-7 print:mb-4 print:gap-2 sm:grid-cols-table-filter-sm print:sm:grid-cols-4">
            {children}
          </div>
          <div className="flex flex-col gap-5 print:hidden md:flex-row md:justify-end">
            <Button mblock secondary onClick={onReset}>
              Återställ
            </Button>
            <Button mblock onClick={() => onSearch()}>
              Sök
            </Button>
          </div>
        </div>
      )}
      <hr className="mb-5 opacity-40 print:hidden lg:mb-10" />
    </>
  )
}
