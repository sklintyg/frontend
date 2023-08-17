import { IDSButton, IDSIconChevron } from '@frontend/ids-react-ts'
import { ReactNode, useState } from 'react'

export function TableFilter({ onSearch, onReset, children }: { onSearch: () => void; onReset: () => void; children: ReactNode }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <>
      <h3 className="ids-heading-4 hidden print:block">Valda filter</h3>
      <IDSButton tertiary size="s" onClick={() => setExpanded(!expanded)} className="my-4 print:hidden">
        <IDSIconChevron size="xs" rotate={expanded ? '270' : '90'} colorpreset={1} className="mr-2 inline" />
        {expanded ? 'Dölj sökfilter' : 'Visa sökfilter'}
      </IDSButton>
      {expanded && (
        <div className="mb-5">
          <div className="mb-7 grid gap-x-10 gap-y-7" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
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
