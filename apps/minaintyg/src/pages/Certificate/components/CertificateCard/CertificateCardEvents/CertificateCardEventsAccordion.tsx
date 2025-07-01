import { IDSIconMinus, IDSIconPlus } from '@inera/ids-react'
import type { ReactNode } from 'react'

export function CertificateCardEventsAccordion({ children }: { children: ReactNode }) {
  return (
    <details className="group py-2.5">
      <summary className="flex items-center justify-between gap-2 font-semibold text-accent-40 group-open:mb-2.5 md:hidden">
        <h4 className="inline-block group-open:hidden">Visa händelser</h4>
        <h4 className="hidden group-open:inline-block">Dölj händelser</h4>
        <IDSIconPlus
          width="100%"
          height="100%"
          inline
          className="h-5 w-5 rounded-full bg-accent-40 p-1 text-white group-open:hidden"
          color="currentColor"
        />
        <IDSIconMinus
          width="100%"
          height="100%"
          inline
          className="hidden h-5 w-5 rounded-full bg-accent-40 p-1 text-white group-open:flex"
          color="currentColor"
        />
      </summary>
      {children}
    </details>
  )
}
