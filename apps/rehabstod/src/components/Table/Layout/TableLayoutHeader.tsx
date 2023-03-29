import { IDSTooltip } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'

export function TableLayoutHeader({
  header,
  onSort,
  index,
  icon,
  description,
}: {
  header: string
  index: number
  onSort: (index: number) => void
  icon: ReactNode
  description: string
}) {
  if (!description || description.length === 0) {
    return (
      <th slot="trigger" onClick={() => onSort(index)} className="whitespace-nowrap">
        {header} {icon}{' '}
      </th>
    )
  }

  return (
    <th onClick={() => onSort(index)} className="whitespace-nowrap">
      <IDSTooltip>
        <p slot="trigger">
          {header} {icon}
        </p>
        <p slot="tooltip">{description}</p>
      </IDSTooltip>
    </th>
  )
}
