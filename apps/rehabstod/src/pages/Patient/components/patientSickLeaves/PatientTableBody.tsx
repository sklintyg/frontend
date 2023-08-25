import { DiagnosisDescription } from '../../../../components/Diagnosis/DiagnosisDescription'
import { DiagnosisInfo } from '../../../../components/Diagnosis/DiagnosisInfo'
import { RiskSignalInfo } from '../../../../components/SickLeave/RiskSignalInfo'
import { SickLeaveDegreeInfo } from '../../../../components/SickLeave/SickLeaveDegreeInfo'
import { useTableContext } from '../../../../components/Table/hooks/useTableContext'
import { TableCell } from '../../../../components/Table/tableBody/TableCell'
import { filterTableColumns } from '../../../../components/Table/utils/filterTableColumns'
import { Tooltip } from '../../../../components/Tooltip/Tooltip'
import { TooltipContent } from '../../../../components/Tooltip/TooltipContent'
import { TooltipTrigger } from '../../../../components/Tooltip/TooltipTrigger'
import { PatientSjukfallIntyg } from '../../../../schemas/patientSchema'
import { useAppSelector } from '../../../../store/hooks'
import { useGetSickLeavesFiltersQuery } from '../../../../store/sickLeaveApi'
import { allPatientColumns } from '../../../../store/slices/patientTableColumns.selector'
import { PatientColumn } from '../../../../store/slices/patientTableColumns.slice'
import { getCertificateColumnData } from '../../utils/getCertificateColumnData'
import { CertificateButton } from '../CertificateButton'

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
  switch (column) {
    case PatientColumn.Diagnos: {
      const diagnosis = [certificate.diagnos, ...certificate.bidiagnoser].filter(Boolean)
      return (
        <TableCell description={diagnosis.length > 0 && <DiagnosisDescription diagnosis={diagnosis} />}>
          <DiagnosisInfo diagnos={certificate.diagnos} biDiagnoser={certificate.bidiagnoser} />
        </TableCell>
      )
    }
    case PatientColumn.Grad:
      return (
        <TableCell>
          <SickLeaveDegreeInfo degrees={certificate.grader} />
        </TableCell>
      )
    case PatientColumn.Risk:
      return <TableCell>{certificate.riskSignal && <RiskSignalInfo {...certificate.riskSignal} />}</TableCell>
    case PatientColumn.Intyg:
      return certificate ? (
        <TableCell sticky="right">
          {certificate.otherVardgivare || certificate.otherVardenhet ? (
            <OtherUnitInformation />
          ) : (
            <CertificateButton certificateId={certificate.intygsId} />
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
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()
  const columns = useAppSelector(allPatientColumns)
  const visibleColumns = filterTableColumns(columns, isDoctor, undefined, true, populatedFilters && populatedFilters.srsActivated, [
    PatientColumn.Intygstyp,
  ])

  return (
    <tbody className="whitespace-normal break-words">
      {sortTableList(certificates, getCertificateColumnData).map(
        (certificate) =>
          columns.length > 0 && (
            <tr key={`${certificate.intygsId}`} className={certificate.otherVardgivare || certificate.otherVardenhet ? 'italic' : ''}>
              {visibleColumns.map(({ name }) => (
                <PatientTableCellResolver key={name} column={name} certificate={certificate} list={certificates} />
              ))}
            </tr>
          )
      )}
    </tbody>
  )
}
