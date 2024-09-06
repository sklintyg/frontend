import { classNames, TertiaryButton } from '@frontend/components'
import type { ReactEventHandler } from 'react'

export function CertificateListOrderButton({ active, label, onClick }: { active: boolean; label: string; onClick: ReactEventHandler }) {
  return (
    <TertiaryButton
      className={classNames(active && 'font-semibold text-neutral-20 pointer-events-none no-underline')}
      onClick={onClick}
      aria-label={label}
    >
      {label}
    </TertiaryButton>
  )
}
