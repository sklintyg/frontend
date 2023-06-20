import { LUCertificatesColumn } from '../../../store/slices/luCertificatesTableColumns.slice'
import { Column } from '../../../components/Table/tableHeader/TableHeader'

export const getLUCertificatesColumnInfo = (column: string): Column => {
  switch (column) {
    case LUCertificatesColumn.Personnummer:
      return { name: column, width: 145 }
    case LUCertificatesColumn.Ålder:
      return { name: column, width: 80 }
    case LUCertificatesColumn.Namn:
      return { name: column, width: 150 }
    case LUCertificatesColumn.Kön:
      return { name: column, width: 65 }
    case LUCertificatesColumn.Intyg:
      return { name: column, width: 145 }
    case LUCertificatesColumn.Diagnos:
      return { name: column, width: 255 }
    case LUCertificatesColumn.Signeringsdatum:
      return { name: column, width: 170 }
    case LUCertificatesColumn.Ärenden:
      return { name: column, width: 200 }
    case LUCertificatesColumn.Läkare:
      return { name: column, width: 150 }
    default:
      return { name: column }
  }
}
