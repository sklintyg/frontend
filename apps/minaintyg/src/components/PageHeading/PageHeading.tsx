import { classNames, hasNoChildren } from '@frontend/components'
import { IDSIconPlus } from '@frontend/ids-react-ts'
import { ReactNode, useState } from 'react'

export function PageHeading({ heading, children }: { heading?: string; children?: ReactNode }) {
  const [clamped, setClamped] = useState(true)
  return (
    <header className="ids-content mb-7">
      {heading && <h1 className="ids-heading-1 text-[min(2.25rem,9.25vw)]/[min(2.25rem,9.25vw)] md:text-5xl">{heading}</h1>}
      {!hasNoChildren(children) && (
        <>
          <p data-clamped={clamped} className={classNames('ids-preamble mb-2', clamped && 'line-clamp-5 md:line-clamp-none')}>
            {children}
          </p>
          {clamped && (
            <button
              aria-label="Visa mer text"
              type="button"
              onClick={() => setClamped(!clamped)}
              className="text-sky-base flex items-center gap-2 md:hidden"
            >
              <IDSIconPlus
                width="100%"
                height="100%"
                inline
                className="bg-sky-base h-5 w-5 rounded-full p-1 text-white"
                color="currentColor"
              />
              <span className="underline">Visa mer text</span>
            </button>
          )}
        </>
      )}
    </header>
  )
}
