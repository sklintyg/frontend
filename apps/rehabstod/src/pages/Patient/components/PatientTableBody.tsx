import { IDSLink } from '@frontend/ids-react-ts'
import { EndDateInfo } from '../../../components/SickLeave/EndDateInfo'
import { SickLeaveDegreeInfo } from '../../../components/SickLeave/SickLeaveDegreeInfo'
import { DiagnosisCell } from '../../../components/Table/DiagnosisCell'
import { useTableContext } from '../../../components/Table/hooks/useTableContext'
import { PatientSjukfallIntyg } from '../../../schemas/patientSchema'
import { isDateBeforeToday } from '../../../utils/isDateBeforeToday'
import { getCertificateColumnData } from '../utils/getCertificateColumnData'

export function PatientTableBody({ certificates }: { certificates: PatientSjukfallIntyg[] }) {
  const { sortTableList } = useTableContext()
  return (
    <tbody>
      {sortTableList(certificates, getCertificateColumnData).map((certificate) => (
        <tr key={`${certificate.start}${certificate.slut}`}>
          <td>{certificates.indexOf(certificate) + 1}</td>
          <DiagnosisCell diagnos={certificate.diagnos} biDiagnoser={certificate.bidiagnoser} />
          <td>{certificate.start}</td>
          <td>
            <EndDateInfo date={certificate.slut} isDateAfterToday={isDateBeforeToday(certificate.slut)} />
          </td>
          <td>{certificate.dagar} dagar</td>
          <td>
            <SickLeaveDegreeInfo degrees={certificate.grader} />
          </td>
          <td>Komplettering ({certificate.obesvaradeKompl})</td>
          <td>{certificate.lakare.namn}</td>
          <td>{certificate.sysselsattning.join(' ')}</td>
          <td>
            {/* TODO: Make link work */}
            <IDSLink>
              <a href={`webcert/${certificate.intygsId}`} target="_blank" rel="noreferrer">
                VISA
              </a>
            </IDSLink>
          </td>
        </tr>
      ))}
    </tbody>
  )
}
