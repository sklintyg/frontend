import { IDSIcon } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'
import { SickLeaveInfo } from '../../../store/types/sickLeave'
import { TableLayoutBody } from './TableLayoutBody'
import { TableLayoutHeader } from './TableLayoutHeader'

export function TableLayout({
  title,
  subTitle,
  tableHeaders,
  tableHeaderDescriptions,
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
  tableHeaderDescriptions: string[]
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
      <IDSIcon name="swap" rotate="90" colorpreset={3} size="s" onClick={() => onSort(index)} className="ml-1 inline" />
    ) : (
      <IDSIcon name="arrow" rotate={ascending ? '270' : '90'} colorpreset={3} size="xs" className="ml-1 inline" />
    )

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
              <TableLayoutHeader
                key={`${id}-table-header-${header}`}
                header={header}
                index={index}
                onSort={onSort}
                icon={getIcon(index)}
                description={tableHeaderDescriptions[index]}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          <TableLayoutBody isLoading={isLoading} title={title} id={id} tableHeaders={tableHeaders} content={content} />
        </tbody>
      </table>
    </div>
  )
}
