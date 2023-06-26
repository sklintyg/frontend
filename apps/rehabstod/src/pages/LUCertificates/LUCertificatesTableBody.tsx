import { useTableContext } from '../../components/Table/hooks/useTableContext'
import { TableRow } from '../../components/Table/tableBody/TableRow'
import { TableColumn } from '../../schemas/tableSchema'
import { LUCertificate } from '../../schemas/luCertificatesSchema'
import { getLUCertificatesTableValue } from './utils/luCertificatesTableValueFormatter'
import { LUCertificatesTableCellResolver } from './LUCertificatesTableCellResolver'

// TODO: Implement on click for TableRow when implement lu in patient view

export function LUCertificatesTableBody({ content, columns }: { content: LUCertificate[]; columns: TableColumn[] }) {
  const { sortTableList } = useTableContext()

  return (
    <tbody className="whitespace-normal break-words">
      {sortTableList(content, getLUCertificatesTableValue).map(
        (item) =>
          columns.length > 0 && (
            <TableRow key={`${item.certificateId}-row`} id={item.certificateId} focusable italic={false}>
              {columns.map(({ name }) => (
                <LUCertificatesTableCellResolver key={`${item.certificateId}${name}`} column={name} data={item} /> // TODO: this should be switched to encrypted patient id
              ))}
            </TableRow>
          )
      )}
    </tbody>
  )
}
