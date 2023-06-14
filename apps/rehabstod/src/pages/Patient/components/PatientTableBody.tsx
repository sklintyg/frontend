import { IDSButton, IDSColumn, IDSIcon, IDSRow } from '@frontend/ids-react-ts'
import { DiagnosisDescription } from '../../../components/SickLeave/DiagnosisDescription'
import { DiagnosisInfo } from '../../../components/SickLeave/DiagnosisInfo'
import { SickLeaveDegreeInfo } from '../../../components/SickLeave/SickLeaveDegreeInfo'
import { TableCell } from '../../../components/Table/TableCell'
import { useTableContext } from '../../../components/Table/hooks/useTableContext'
import { Tooltip } from '../../../components/Tooltip/Tooltip'
import { TooltipContent } from '../../../components/Tooltip/TooltipContent'
import { TooltipTrigger } from '../../../components/Tooltip/TooltipTrigger'
import { PatientSjukfallIntyg } from '../../../schemas/patientSchema'
import { useGetUserQuery } from '../../../store/api'
import { useAppSelector } from '../../../store/hooks'
import { allPatientColumns } from '../../../store/slices/patientTableColumns.selector'
import { PatientColumn } from '../../../store/slices/patientTableColumns.slice'
import { usePatient } from '../hooks/usePatient'
import { getCertificateColumnData } from '../utils/getCertificateColumnData'

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
  belongsToOtherUnit,
}: {
  column: string
  list: PatientSjukfallIntyg[]
  certificate: PatientSjukfallIntyg
  belongsToOtherUnit: boolean
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
          {belongsToOtherUnit ? (
            <OtherUnitInformation />
          ) : (
            <IDSButton
              tertiary
              onClick={() => {
                navigateToWebcert(certificate.intygsId)
              }}
            >
              <IDSRow align="center">
                <IDSColumn cols="auto">Visa </IDSColumn>
                <IDSColumn cols="auto" className="ml-2">
                  <IDSIcon name="external" height="16" width="100%" />
                </IDSColumn>
              </IDSRow>
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
  const { data: user } = useGetUserQuery()
  return (
    <tbody className="whitespace-normal break-words">
      {sortTableList(certificates, getCertificateColumnData).map(
        (certificate) =>
          columns.length > 0 && (
            <tr
              key={`${certificate.start}${certificate.slut}`}
              className={user?.valdVardenhet?.id !== certificate.vardenhetId ? 'italic' : ''}
            >
              {columns
                .filter(({ visible }) => visible)
                .filter(({ name }) => !(isDoctor && name === PatientColumn.Läkare))
                .map(({ name }) => (
                  <PatientTableCellResolver
                    key={name}
                    column={name}
                    certificate={certificate}
                    belongsToOtherUnit={user?.valdVardenhet?.id !== certificate.vardenhetId}
                    list={certificates}
                  />
                ))}
            </tr>
          )
      )}
    </tbody>
  )
}
