import type { FormEventHandler, ReactNode } from 'react'

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
      <div className="border border-[#CCC] shadow-[0_2px_6px_0_rgba(0,0,0,0.15)] rounded p-5 flex flex-col gap-5 mb-5">{children}</div>
      {actions}
    </form>
  )
}
