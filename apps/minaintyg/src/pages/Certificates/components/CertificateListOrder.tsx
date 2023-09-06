import { classNames } from '@frontend/components'
import { ReactEventHandler, ReactNode } from 'react'
import { SortDirection } from 'react-stately'

export function SortingButton({ active, onClick, children }: { active: boolean; onClick: ReactEventHandler; children: ReactNode }) {
  return (
    <button
      type="button"
      className={classNames(active ? 'font-semibold pointer-events-none' : 'text-sky-base underline')}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function CertificateListOrder({ order, setOrder }: { order: SortDirection; setOrder: (order: SortDirection) => void }) {
  return (
    <div className="text-stone-dark mb-5 flex flex-col md:flex-row md:gap-1">
      Sortera efter:{' '}
      <div className="inline-flex gap-1">
        <SortingButton active={order === 'descending'} onClick={() => setOrder('descending')}>
          Nyast först
        </SortingButton>
        <div role="separator">|</div>
        <SortingButton active={order === 'ascending'} onClick={() => setOrder('ascending')}>
          Äldst först
        </SortingButton>
      </div>
    </div>
  )
}
