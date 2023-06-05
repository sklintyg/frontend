import { IDSButton, IDSColumn, IDSIcon, IDSRow } from '@frontend/ids-react-ts'
import { DiagnosisDescription } from '../../../components/SickLeave/DiagnosisDescription'
import { DiagnosisInfo } from '../../../components/SickLeave/DiagnosisInfo'
import { SickLeaveDegreeInfo } from '../../../components/SickLeave/SickLeaveDegreeInfo'
import { useTableContext } from '../../../components/Table/hooks/useTableContext'
import { TableCell } from '../../../components/Table/TableCell'
import { PatientSjukfallIntyg } from '../../../schemas/patientSchema'
import { useAppSelector } from '../../../store/hooks'
import { allPatientColumns } from '../../../store/slices/patientTableColumns.selector'
import { PatientColumn } from '../../../store/slices/patientTableColumns.slice'
import { usePatient } from '../hooks/usePatient'
import { getCertificateColumnData } from '../utils/getCertificateColumnData'
import { getQAStatusFormat } from '../utils/getQAStatusFormat'

function PatientTableCellResolver({
  column,
  rowIndex,
  certificate,
}: {
  column: string
  rowIndex: number
  certificate: PatientSjukfallIntyg
}) {
  const { navigateToWebcert } = usePatient()

  switch (column) {
    case PatientColumn.Num:
      return <TableCell>{rowIndex}</TableCell>
    case PatientColumn.Diagnos:
      return (
        <TableCell
          description={certificate.diagnos && <DiagnosisDescription diagnos={certificate.diagnos} biDiagnoser={certificate.bidiagnoser} />}>
          <DiagnosisInfo diagnos={certificate.diagnos} biDiagnoser={certificate.bidiagnoser} />
        </TableCell>
      )
    case PatientColumn.Startdatum:
      return <TableCell>{certificate.start}</TableCell>
    case PatientColumn.Slutdatum:
      return <TableCell>{certificate.slut}</TableCell>
    case PatientColumn.Längd:
      return <TableCell>{certificate.dagar} dagar</TableCell>
    case PatientColumn.Grad:
      return (
        <TableCell>
          <SickLeaveDegreeInfo degrees={certificate.grader} />
        </TableCell>
      )
    case PatientColumn.Ärenden:
      return (
        <TableCell>
          <span className="whitespace-pre-line">{getQAStatusFormat(certificate.obesvaradeKompl, certificate.unansweredOther)}</span>
        </TableCell>
      )
    case PatientColumn.Läkare:
      return <TableCell>{certificate.lakare ? certificate.lakare.namn : 'Okänt'}</TableCell>
    case PatientColumn.Sysselsättning:
      return <TableCell>{certificate.sysselsattning.length > 0 ? certificate.sysselsattning.join(' ') : 'Okänt'}</TableCell>
    case PatientColumn.Vårdenhet:
      return <TableCell>{certificate.vardenhetNamn}</TableCell>
    case PatientColumn.Vårdgivare:
      return <TableCell>{certificate.vardgivareNamn}</TableCell>
    case PatientColumn.Intyg:
      return certificate ? (
        <TableCell sticky="right">
          <IDSButton
            tertiary
            onClick={() => {
              navigateToWebcert(certificate.intygsId)
            }}>
            <IDSRow align="center">
              <IDSColumn cols="auto">Visa </IDSColumn>
              <IDSColumn cols="auto" className="ml-2">
                <IDSIcon name="external" height="16" width="100%" />
              </IDSColumn>
            </IDSRow>
          </IDSButton>
        </TableCell>
      ) : (
        <>-</>
      )
    default:
      return null
  }
}

export function PatientTableBody({ certificates, isDoctor }: { certificates: PatientSjukfallIntyg[]; isDoctor: boolean }) {
  const { sortTableList } = useTableContext()
  const columns = useAppSelector(allPatientColumns)
  return (
    <tbody className="whitespace-normal break-words">
      {sortTableList(certificates, getCertificateColumnData).map(
        (certificate) =>
          columns.length > 0 && (
            <tr key={`${certificate.start}${certificate.slut}`}>
              {columns
                .filter(({ visible }) => visible)
                .filter(({ name }) => !(isDoctor && name === PatientColumn.Läkare))
                .map(({ name }) => (
                  <PatientTableCellResolver
                    key={name}
                    column={name}
                    certificate={certificate}
                    rowIndex={certificates.indexOf(certificate) + 1}
                  />
                ))}
            </tr>
          )
      )}
    </tbody>
  )
}
