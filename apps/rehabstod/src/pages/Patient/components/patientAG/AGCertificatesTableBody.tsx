import type { AGCertificate } from '../../../../schemas/agCertificatesSchema'
import { useTableContext } from '../../../../components/Table/hooks/useTableContext'
import type { TableColumn } from '../../../../schemas/tableSchema'
import { TableRow } from '../../../../components/Table/tableBody/TableRow'
import { getAGCertificatesTableValue } from './agCertificatesTableValueFormatter'
import { AGCertificatesTableCellResolver } from './AGCertificatesTableCellResolver'

export function AGCertificatesTableBody({ content, columns }: { content: AGCertificate[]; columns: TableColumn[] }) {
  const { sortTableList } = useTableContext()

  return (
    <tbody className="whitespace-normal break-words">
      {sortTableList(content, getAGCertificatesTableValue).map(
        (item) =>
          columns.length > 0 && (
            <TableRow key={`${item.certificateId}-row`} italic={false} data={item}>
              {columns.map(({ name }) => (
                <AGCertificatesTableCellResolver key={`${item.certificateId}${name}`} column={name} data={item} list={content} />
              ))}
            </TableRow>
          )
      )}
    </tbody>
  )
}
