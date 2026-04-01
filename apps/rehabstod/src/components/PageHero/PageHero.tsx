import { Icon } from '@frontend/components'
import type { ReactNode } from 'react'

const userHeroIconStyle = {
  backgroundColor: 'var(--ids-color-surface-background-elevated-1)',
  border: '1px solid var(--ids-color-surface-border-elevated-1)',
  color: 'var(--ids-color-brand-text-primary)',
}

export function PageHero({ type, children }: { type?: 'error' | 'user'; children?: ReactNode }) {
  return (
    <div className="px-5 md:p-0">
      <div className="ids-content mx-auto max-w-screen-md py-24 text-center">
        {type === 'error' && (
          <div className="mb-10 inline-block text-error-40">
            <Icon icon="attention" className="inline-block h-[4.375rem] w-[4.375rem]" />
          </div>
        )}
        {type === 'user' && (
          <div style={userHeroIconStyle} className="mb-7 inline-block rounded-full px-6 py-5">
            <Icon icon="user" className="text-[3.75rem]" />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
