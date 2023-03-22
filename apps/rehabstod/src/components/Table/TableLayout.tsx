import { SickLeaveInfo } from '../../store/types/sickLeave'
import { CurrentSickLeaveInfo } from './CurrentSickLeaves/CurrentSickLeaveInfo'
import { ReactNode, useState } from 'react'
import { Divider } from '@frontend/common'
import { IDSIcon } from '@frontend/ids-react-ts'

export function TableLayout({
  title,
  subTitle,
  tableHeaders,
  content,
  id,
  filters,
  onSort,
}: {
  title: string
  subTitle: string
  tableHeaders: string[]
  content: SickLeaveInfo[]
  id: string
  filters: ReactNode
  onSort: (index: number) => void
}) {
  const [sortedColumn, setSortedColumn] = useState(5)
  const [ascending, setAscending] = useState(false)

  const handleSortColumn = (index: number) => {
    setAscending(index === sortedColumn ? !ascending : false)
    setSortedColumn(index)
    onSort(index)
  }

  const getIcon = (index: number) => {
    if (index !== sortedColumn) {
      return <IDSIcon name="swap" rotate={90} colorpreset={3} size="s" onClick={() => handleSortColumn(index)} className="inline ml-1" />
    } else {
      return <IDSIcon name="arrow" rotate={ascending ? 270 : 90} colorpreset={3} size="xs" className="inline ml-1" />
    }
  }

  return (
    <div className="ids-content py-10">
      <h1 className="ids-heading-2">{title}</h1>
      <h2 className="ids-heading-3">{subTitle}</h2>
      <Divider />
      <div>{filters}</div>
      <Divider />
      <table className="ids-table my-10 mx-0">
        <thead>
          <tr>
            {tableHeaders.map((header, index) => {
              return (
                <th key={`${id}-table-header-${index}`} onClick={() => handleSortColumn(index)}>
                  {header}
                  {getIcon(index)}
                </th>
              )
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
