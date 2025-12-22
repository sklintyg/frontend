import type { FormEventHandler, ReactNode } from 'react'
import { PPFieldset } from './PPFieldset'

export function PPForm({
  actions,
  onSubmit,
  onInput,
  children,
}: {
  actions: ReactNode
  onSubmit: FormEventHandler<HTMLFormElement>
  onInput?: FormEventHandler<HTMLFormElement>
  children: ReactNode
}) {
  return (
    <form onSubmit={onSubmit} onInput={onInput} noValidate>
      <PPFieldset>{children}</PPFieldset>
      {actions}
    </form>
  )
}
