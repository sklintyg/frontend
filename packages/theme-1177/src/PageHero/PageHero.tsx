import { Heading, Icon } from '@frontend/components'
import type { ReactNode } from 'react'

export function PageHero({ heading, type, children }: { heading: ReactNode; type: 'success' | 'error' | 'none'; children: ReactNode }) {
  return (
    <div className="ids-content mx-auto flex max-w-[620px] flex-col gap-10 pt-12 text-center md:pt-24">
      <div
        className="mx-auto"
        style={{ fontSize: '72px', color: type === 'success' ? 'var(--IDS-COLOR-SUCCESS-40)' : 'var(--IDS-COLOR-PRIMARY-40)' }}
      >
        {type === 'success' && <Icon icon="success" />}
        {type === 'error' && <Icon icon="attention" />}
      </div>

      <div>
        <Heading level={1} size="xxl" className="text-center">
          {heading}
        </Heading>
        {children}
      </div>
    </div>
  )
}
