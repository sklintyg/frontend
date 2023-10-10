import { classNames } from '@frontend/components'
import { IDSIconPlus } from '@frontend/ids-react-ts'
import { ReactNode, useState } from 'react'

export function PageHeading({ heading, children }: { heading: string; children: ReactNode }) {
  const [clamped, setClamped] = useState(true)
  return (
    <header className="ids-content mb-7">
      <h1 className="ids-heading-1">{heading}</h1>
      <p data-clamped={clamped} className={classNames('ids-preamble mb-2', clamped && 'line-clamp-5 md:line-clamp-none')}>
        {children}
      </p>
      {clamped && (
        <button
          aria-label="Visa mer text"
          type="button"
          onClick={() => setClamped(!clamped)}
          className="flex items-center gap-2 text-sky-base md:hidden"
        >
          <IDSIconPlus width="100%" height="100%" inline className="h-5 w-5 rounded-full bg-sky-base p-1 text-white" color="currentColor" />
          <span className="underline">Visa mer text</span>
        </button>
      )}
    </header>
  )
}
