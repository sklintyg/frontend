import { IDSIconAttention, IDSIconUser } from '@inera/ids-react'
import type { ReactNode } from 'react'

export function PageHero({ type, children }: { type?: 'error' | 'user'; children?: ReactNode }) {
  return (
    <div className="px-5 md:p-0">
      <div className="ids-content mx-auto max-w-screen-md py-24 text-center">
        {type === 'error' && (
          <div className="mb-10 inline-block text-error-40">
            <IDSIconAttention height="4.375rem" width="4.375rem" color="currentColor" color2="currentColor" />
          </div>
        )}
        {type === 'user' && (
          <div style={{ background: '#c6d2df' }} className="mb-7 inline-block rounded-full px-6 py-5">
            <IDSIconUser height="3.75rem" width="3.125rem" color="#396291" color2="#3b4266" />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
