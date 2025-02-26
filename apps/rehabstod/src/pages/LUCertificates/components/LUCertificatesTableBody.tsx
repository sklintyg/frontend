import { useNavigate } from 'react-router-dom'
import { useTableContext } from '../../../components/Table/hooks/useTableContext'
import { TableRow } from '../../../components/Table/tableBody/TableRow'
import type { LUCertificate } from '../../../schemas/luCertificatesSchema'
import type { TableColumn } from '../../../schemas/tableSchema'
import { getLUCertificatesTableValue } from '../utils/luCertificatesTableValueFormatter'
import { LUCertificatesTableCellResolver } from './LUCertificatesTableCellResolver'

export function LUCertificatesTableBody({
  content,
  columns,
  clickable = false,
  focusable = false,
}: {
  content: LUCertificate[]
  columns: TableColumn[]
  clickable?: boolean
  focusable?: boolean
}) {
  const { sortTableList } = useTableContext()
  const navigate = useNavigate()

  const navigateToPatient = (data: LUCertificate) => {
    navigate(`/lakarutlatanden/${data.encryptedPatientId}`)
  }

  const sortedList = sortTableList(content, getLUCertificatesTableValue)

  return (
    <tbody className="whitespace-normal break-words">
      {sortedList.map(
        (item) =>
          columns.length > 0 && (
            <TableRow
              key={`${item.certificateId}-row`}
              focusable={focusable}
              italic={false}
              data={item}
              onNavigate={clickable ? navigateToPatient : undefined}
            >
              {columns.map(({ name }) => (
                <LUCertificatesTableCellResolver key={`${item.certificateId}${name}`} column={name} data={item} list={sortedList} />
              ))}
            </TableRow>
          )
      )}
    </tbody>
  )
}
