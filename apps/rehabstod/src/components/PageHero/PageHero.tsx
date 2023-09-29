import { IDSIconAttention, IDSIconUser } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'

export function PageHero({ type, children }: { type?: 'error' | 'user'; children?: ReactNode }) {
  return (
    <div className="px-5 md:p-0">
      <div className="ids-content mx-auto max-w-screen-md py-24 text-center">
        {type === 'error' && (
          <div className="text-error-40 mb-10 inline-block">
            <IDSIconAttention height="4.375rem" width="4.375rem" color="currentColor" color2="currentColor" />
          </div>
        )}
        {type === 'user' && (
          <div className="bg-secondary-90 text-primary-40 mb-7 inline-block rounded-full px-6 py-5">
            <IDSIconUser height="3.75rem" width="3.125rem" color="currentColor" color2="currentColor" />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
