import { Column } from '../../../../components/Table/types/Column'
import { PatientColumn } from '../../../../store/slices/patientTableColumns.slice'

export const getAGCertificatesColumnInfo = (column: string): Column => {
  switch (column) {
    case PatientColumn.Num:
      return { name: column, width: 62 }
    case PatientColumn.Diagnos:
      return { name: column, width: 255 }
    case PatientColumn.Startdatum:
      return { name: column, width: 120 }
    case PatientColumn.Slutdatum:
      return { name: column, width: 120 }
    case PatientColumn.Längd:
      return { name: column, width: 90 }
    case PatientColumn.Grad:
      return { name: column, width: 100 }
    case PatientColumn.Ärenden:
      return { name: column, width: 170 }
    case PatientColumn.Läkare:
      return { name: column, width: 114 }
    case PatientColumn.Sysselsättning:
      return { name: column, width: 140 }
    case PatientColumn.Vårdenhet:
      return { name: column, width: 120 }
    case PatientColumn.Vårdgivare:
      return { name: column, width: 120 }
    case PatientColumn.Intygstyp:
      return { name: column, width: 120 }
    case PatientColumn.Intyg:
      return { name: column, width: 100, sticky: 'right' }
    default:
      return { name: column }
  }
}
