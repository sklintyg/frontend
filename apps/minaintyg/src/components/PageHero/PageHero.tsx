import { IDSIconSuccess } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'

export function PageHero({ heading, type, children }: { heading: ReactNode; type: 'success' | 'error'; children: ReactNode }) {
  return (
    <div className="ids-content mx-auto flex max-w-[620px] flex-col gap-10 pt-12 text-center md:pt-24">
      {type === 'success' && (
        <IDSIconSuccess
          inline
          className="mx-auto"
          width="70px"
          height="70px"
          color="var(--color-grass-dark)"
          color2="var(--color-grass-base)"
        />
      )}
      <div>
        <h1 className="ids-heading-1 text-center">{heading}</h1>
        {children}
      </div>
    </div>
  )
}
