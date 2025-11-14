import { Heading } from '@frontend/components'
import type { ReactNode } from 'react'

export function SettingsDialogInput({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="[&:not(:last-child)]:mb-5">
      <Heading level={2} size="xs">
        {title}
      </Heading>
      <p className="pb-4">{description}</p>
      {children}
    </div>
  )
}
