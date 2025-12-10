import type { FormEventHandler, ReactNode } from 'react'
import { StatusBox } from './StatusBox'

export function PPForm({
  actions,
  isZipCodeError,
  onSubmit,
  onInput,
  children,
}: {
  actions: ReactNode
  isZipCodeError?: boolean
  onSubmit: FormEventHandler<HTMLFormElement>
  onInput?: FormEventHandler<HTMLFormElement>
  children: ReactNode
}) {
  return (
    <form onSubmit={onSubmit} onInput={onInput} noValidate>
      <div className="border border-[#CCC] shadow-[0_2px_6px_0_rgba(0,0,0,0.15)] rounded p-5 flex flex-col gap-5 mb-5">{children}</div>
      {isZipCodeError && <StatusBox type="ERROR">Ett tekniskt fel har uppstått. Adressuppgifter kan inte hämtas. Försök igen senare.</StatusBox>}
      {actions}
    </form>
  )
}
