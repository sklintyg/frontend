import { SickLeaveInfo } from '../../store/types/sickLeave'
import { CurrentSickLeaveInfo } from './CurrentSickLeaves/CurrentSickLeaveInfo'
import { ReactNode } from 'react'
import { Divider } from '@frontend/common'

export function TableLayout({
  title,
  subTitle,
  tableHeaders,
  content,
  id,
  filters,
}: {
  title: string
  subTitle: string
  tableHeaders: string[]
  content: SickLeaveInfo[]
  id: string
  filters: ReactNode
}) {
  return (
    <div className="ids-content py-10">
      <h1 className="ids-heading-2">{title}</h1>
      <h2 className="ids-heading-3">{subTitle}</h2>
      <Divider />
      <div>{filters}</div>
      <Divider />
      <table className="ids-table my-10 mx-0 w-full">
        <thead>
          <tr>
            {tableHeaders.map((header, index) => {
              return <th key={`${id}-table-header-${index}`}>{header}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {content && content.length > 0 ? (
            content.map((item, index) => {
              return <tr key={`${id}-table-row-${index}`}>{<CurrentSickLeaveInfo sickLeave={item} />}</tr>
            })
          ) : (
            <tr>
              <td colSpan={tableHeaders.length}>Inga resultat</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
