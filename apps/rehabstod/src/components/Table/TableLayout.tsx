import { ReactNode } from 'react'
import { IDSIcon, IDSSpinner } from '@frontend/ids-react-ts'
import { SickLeaveInfo } from '../../store/types/sickLeave'
import { getSickLeaveContent } from '../../utils/listUtils'

export function TableLayout({
  title,
  subTitle,
  tableHeaders,
  content,
  id,
  filters,
  infoBar,
  onSort,
  sortedColumn,
  ascending,
  isLoading,
}: {
  title: string
  subTitle: string
  tableHeaders: string[]
  content: SickLeaveInfo[] | undefined
  id: string
  filters: ReactNode
  infoBar: ReactNode
  onSort: (index: number) => void
  sortedColumn: number
  ascending: boolean
  isLoading: boolean
}) {
  const getIcon = (index: number) =>
    index !== sortedColumn ? (
      <IDSIcon name="swap" rotate={90} colorpreset={3} size="s" onClick={() => onSort(index)} className="ml-1 inline" />
    ) : (
      <IDSIcon name="arrow" rotate={ascending ? 270 : 90} colorpreset={3} size="xs" className="ml-1 inline" />
    )

  const getTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={tableHeaders.length}>
            <IDSSpinner />
          </td>
        </tr>
      )
    }

    if (content && content.length > 0) {
      return content.map((item, index) => (
        <tr key={`${id}-table-row-${index}`}>
          {tableHeaders.map((header) => (
            <td>{getSickLeaveContent(header, item)}</td>
          ))}
        </tr>
      ))
    }

    return (
      <tr>
        <td colSpan={tableHeaders.length}>
          {!content
            ? `Tryck på Sök för att visa alla dina ${title.toLowerCase()} för enheten, eller ange filterval och tryck på Sök för att visa urval av dina ${title.toLowerCase()}.`
            : 'Inga resultat'}
        </td>
      </tr>
    )
  }

  return (
    <div className="ids-content py-10">
      <h1 className="ids-heading-2">{title}</h1>
      <h2 className="ids-heading-3 mb-10">{subTitle}</h2>
      <hr className="opacity-40" />
      <div>{filters}</div>
      <hr className="opacity-40" />
      <div className="mt-10">{infoBar}</div>
      <table className="ids-table mx-0">
        <thead>
          <tr>
            {tableHeaders.map((header, index) => (
              <th key={`${id}-table-header-${header}`} onClick={() => onSort(index)} className="whitespace-nowrap">
                {header}
                {getIcon(index)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{getTableBody()}</tbody>
      </table>
    </div>
  )
}
