import type { ReactNode } from 'react'
import type { User } from '../../../schemas'
import { isUserDoctor } from '../../../utils/isUserDoctor'
import { TableHeading } from './TableHeading'

export function TableHeadingForUnit({
  children,
  user,
  tableName,
  suffix,
  hideUserSpecifics,
  hideDivider = false,
}: {
  children?: ReactNode
  user?: User
  tableName: string
  suffix?: string
  hideUserSpecifics?: boolean
  hideDivider?: boolean
}) {
  if (!user) {
    return null
  }

  const prefix = isUserDoctor(user) ? 'Mina' : 'Alla'
  const userUnit = user && user.valdVardenhet
  const title = [!hideUserSpecifics && prefix, tableName, suffix].filter(Boolean).join(' ')
  const printTitle = [!hideUserSpecifics && prefix, tableName, userUnit && `på ${userUnit.namn}`, suffix].filter(Boolean).join(' ')

  return (
    <div className="mb-5 flex flex-col lg:mb-0 lg:flex-row">
      <TableHeading hideDivider={hideDivider} title={title} subTitle={userUnit ? userUnit.namn : ''} printTitle={printTitle} />
      {children}
    </div>
  )
}
