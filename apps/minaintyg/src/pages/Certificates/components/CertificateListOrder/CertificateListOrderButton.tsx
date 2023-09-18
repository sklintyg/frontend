import { classNames } from '@frontend/components'
import { ReactEventHandler } from 'react'

export function CertificateListOrderButton({ active, label, onClick }: { active: boolean; label: string; onClick: ReactEventHandler }) {
  return (
    <button
      type="button"
      className={classNames(active ? 'font-semibold pointer-events-none' : 'text-sky-base underline')}
      onClick={onClick}
      aria-label={label}
    >
      {label}
    </button>
  )
}
