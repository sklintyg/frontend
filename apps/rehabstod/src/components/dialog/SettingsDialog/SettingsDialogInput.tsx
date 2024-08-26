import type { ReactNode } from 'react'

export function SettingsDialogInput({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="[&:not(:last-child)]:mb-5">
      <h2 className="ids-heading-4 pb-2">{title}</h2>
      <p className="pb-4">{description}</p>
      {children}
    </div>
  )
}
