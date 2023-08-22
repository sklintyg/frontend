import { useNavigate } from 'react-router-dom'
import { useTableContext } from '../../components/Table/hooks/useTableContext'
import { TableRow } from '../../components/Table/tableBody/TableRow'
import { LUCertificate } from '../../schemas/luCertificatesSchema'
import { TableColumn } from '../../schemas/tableSchema'
import { LUCertificatesTableCellResolver } from './LUCertificatesTableCellResolver'
import { getLUCertificatesTableValue } from './utils/luCertificatesTableValueFormatter'

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

  return (
    <tbody className="whitespace-normal break-words">
      {sortTableList(content, getLUCertificatesTableValue).map(
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
                <LUCertificatesTableCellResolver key={`${item.certificateId}${name}`} column={name} data={item} list={content} />
              ))}
            </TableRow>
          )
      )}
    </tbody>
  )
}
