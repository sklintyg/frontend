import { Icon } from '@frontend/components'
import type { ReactNode } from 'react'

export function CertificateCardEventsAccordion({ children }: { children: ReactNode }) {
  return (
    <details className="group py-2.5">
      <summary className="flex items-center justify-between gap-2 font-semibold text-accent-40 group-open:mb-2.5 md:hidden">
        <h4 className="inline-block group-open:hidden">Visa händelser</h4>
        <h4 className="hidden group-open:inline-block">Dölj händelser</h4>
        <div className="flex h-5 w-5 items-center rounded-full bg-accent-40 p-1 text-white">
          <Icon icon="plus" size="xs" className="group-open:hidden" />
          <Icon icon="minus" size="xs" className="hidden group-open:inline" />
        </div>
      </summary>
      {children}
    </details>
  )
}
