import { IDSButton, IDSIconExternal } from '@frontend/ids-react-ts'
import { PatientSjukfallIntyg } from '../../../../schemas/patientSchema'
import { usePatient } from '../../hooks/usePatient'
import { PatientColumn } from '../../../../store/slices/patientTableColumns.slice'
import { DiagnosisInfo } from '../../../../components/Diagnosis/DiagnosisInfo'
import { SickLeaveDegreeInfo } from '../../../../components/SickLeave/SickLeaveDegreeInfo'
import { TableCell } from '../../../../components/Table/tableBody/TableCell'
import { allPatientColumns } from '../../../../store/slices/patientTableColumns.selector'
import { getCertificateColumnData } from '../../utils/getCertificateColumnData'
import { useAppSelector } from '../../../../store/hooks'
import { useTableContext } from '../../../../components/Table/hooks/useTableContext'
import { DiagnosisDescription } from '../../../../components/Diagnosis/DiagnosisDescription'
import { Tooltip } from '../../../../components/Tooltip/Tooltip'
import { TooltipTrigger } from '../../../../components/Tooltip/TooltipTrigger'
import { TooltipContent } from '../../../../components/Tooltip/TooltipContent'

function OtherUnitInformation() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="inline-block h-6 w-6 text-center">-</div>
      </TooltipTrigger>
      <TooltipContent>Du kan inte visa intyg från annan vårdenhet eller vårdgivare</TooltipContent>
    </Tooltip>
  )
}

function PatientTableCellResolver({
  column,
  list,
  certificate,
}: {
  column: string
  list: PatientSjukfallIntyg[]
  certificate: PatientSjukfallIntyg
}) {
  const { navigateToWebcert } = usePatient()
  switch (column) {
    case PatientColumn.Diagnos:
      return (
        <TableCell
          description={certificate.diagnos && <DiagnosisDescription diagnos={certificate.diagnos} biDiagnoser={certificate.bidiagnoser} />}
        >
          <DiagnosisInfo diagnos={certificate.diagnos} biDiagnoser={certificate.bidiagnoser} />
        </TableCell>
      )
    case PatientColumn.Grad:
      return (
        <TableCell>
          <SickLeaveDegreeInfo degrees={certificate.grader} />
        </TableCell>
      )
    case PatientColumn.Intyg:
      return certificate ? (
        <TableCell sticky="right">
          {certificate.otherVardgivare || certificate.otherVardenhet ? (
            <OtherUnitInformation />
          ) : (
            <IDSButton
              tertiary
              onClick={() => {
                navigateToWebcert(certificate.intygsId)
              }}
              className="whitespace-nowrap"
            >
              Visa
              <IDSIconExternal height="16" width="16" className="ml-2 inline align-middle" />
            </IDSButton>
          )}
        </TableCell>
      ) : (
        <>-</>
      )
    default:
      return (
        <TableCell>
          <span className="whitespace-pre-line">{getCertificateColumnData(column, certificate, list)}</span>
        </TableCell>
      )
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
            <tr key={`${certificate.intygsId}`} className={certificate.otherVardgivare || certificate.otherVardenhet ? 'italic' : ''}>
              {columns
                .filter(({ visible }) => visible)
                .filter(({ name }) => !(isDoctor && name === PatientColumn.Läkare))
                .map(({ name }) => (
                  <PatientTableCellResolver key={name} column={name} certificate={certificate} list={certificates} />
                ))}
            </tr>
          )
      )}
    </tbody>
  )
}
