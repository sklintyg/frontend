import { Icon } from '@frontend/components'
import type { MouseEventHandler } from 'react'

export function ExpandStatisticsButton({ onClick, open }: { onClick: MouseEventHandler; open: boolean }) {
  return (
    <button type="button" className="xl:hidden" onClick={onClick}>
      <div className="flex items-center gap-2 leading-6 text-accent-40 underline">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-40 text-white">
          {!open && <Icon icon="plus" />}
          {open && <Icon icon="minus" />}
        </div>
        Visa statistik per kön
      </div>
    </button>
  )
}
