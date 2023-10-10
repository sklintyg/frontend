import { IDSIconMinus, IDSIconPlus } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'

export function CertificateCardEventsAccordion({ children }: { children: ReactNode }) {
  return (
    <details className="group py-2.5">
      <summary className="flex items-center justify-between gap-2 font-semibold text-sky-base group-open:mb-2.5 md:hidden">
        <span className="inline-block group-open:hidden">Visa händelser</span>
        <span className="hidden group-open:inline-block">Dölj händelser</span>
        <IDSIconPlus
          width="100%"
          height="100%"
          inline
          className="h-5 w-5 rounded-full bg-sky-base p-1 text-white group-open:hidden"
          color="currentColor"
        />
        <IDSIconMinus
          width="100%"
          height="100%"
          inline
          className="hidden h-5 w-5 rounded-full bg-sky-base p-1 text-white group-open:flex"
          color="currentColor"
        />
      </summary>
      {children}
    </details>
  )
}
