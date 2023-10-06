import { SortDirection } from 'react-stately'
import { CertificateListOrderButton } from './CertificateListOrderButton'

export function CertificateListOrder({ order, setOrder }: { order: SortDirection; setOrder: (order: SortDirection) => void }) {
  return (
    <div className="mb-5 flex flex-col text-stone-dark md:flex-row md:gap-1">
      Sortera efter:{' '}
      <div className="inline-flex gap-1">
        <CertificateListOrderButton active={order === 'descending'} label="Nyast först" onClick={() => setOrder('descending')} />
        <div role="separator">|</div>
        <CertificateListOrderButton active={order === 'ascending'} label="Äldst först" onClick={() => setOrder('ascending')} />
      </div>
    </div>
  )
}
