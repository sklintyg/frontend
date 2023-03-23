import { ReactNode } from 'react'
import { SickLeaveInfo } from '../../store/types/sickLeave'
import { CurrentSickLeaveInfo } from './CurrentSickLeaves/CurrentSickLeaveInfo'
import { IDSIcon } from '@frontend/ids-react-ts'

export function TableLayout({
  title,
  subTitle,
  tableHeaders,
  content,
  id,
  filters,
  onSort,
  sortedColumn,
  ascending,
}: {
  title: string
  subTitle: string
  tableHeaders: string[]
  content: SickLeaveInfo[]
  id: string
  filters: ReactNode
  onSort: (index: number) => void
  sortedColumn: number
  ascending: boolean
}) {
  const getIcon = (index: number) => {
    if (index !== sortedColumn) {
      return <IDSIcon name="swap" rotate={90} colorpreset={3} size="s" onClick={() => onSort(index)} className="ml-1 inline" />
    }
      return <IDSIcon name="arrow" rotate={ascending ? 270 : 90} colorpreset={3} size="xs" className="ml-1 inline" />
    
  }

  return (
    <div className="ids-content py-10">
      <h1 className="ids-heading-2">{title}</h1>
      <h2 className="ids-heading-3">{subTitle}</h2>
      <hr />
      <div>{filters}</div>
      <hr />
      <table className="ids-table my-10 mx-0">
        <thead>
          <tr>
            {tableHeaders.map((header, index) => (
              <th key={`${id}-table-header-${index}`} onClick={() => onSort(index)}>
                {header}
                {getIcon(index)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content && content.length > 0 ? (
            content.map((item, index) => <tr key={`${id}-table-row-${index}`}><CurrentSickLeaveInfo sickLeave={item} /></tr>)
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
