import { IDSLink } from '@frontend/ids-react-ts'
import { SickLeaveDegreeInfo } from '../../../components/SickLeave/SickLeaveDegreeInfo'
import { DiagnosisCell } from '../../../components/Table/DiagnosisCell'
import { useTableContext } from '../../../components/Table/hooks/useTableContext'
import { PatientSjukfallIntyg } from '../../../schemas/patientSchema'
import { getCertificateColumnData } from '../utils/getCertificateColumnData'
import { getQAStatusFormat } from '../utils/getQAStatusFormat'

export function PatientTableBody({ certificates }: { certificates: PatientSjukfallIntyg[] }) {
  const { sortTableList } = useTableContext()
  return (
    <tbody className="whitespace-normal break-words">
      {sortTableList(certificates, getCertificateColumnData).map((certificate) => (
        <tr key={`${certificate.start}${certificate.slut}`}>
          <td>{certificates.indexOf(certificate) + 1}</td>
          <DiagnosisCell diagnos={certificate.diagnos} biDiagnoser={certificate.bidiagnoser} />
          <td>{certificate.start}</td>
          <td>{certificate.slut}</td>
          <td>{certificate.dagar} dagar</td>
          <td>
            <SickLeaveDegreeInfo degrees={certificate.grader} />
          </td>
          <td className="whitespace-pre-line">{getQAStatusFormat(certificate.obesvaradeKompl, certificate.unansweredOther)}</td>
          <td>{certificate.lakare.namn}</td>
          <td>{certificate.sysselsattning.join(' ')}</td>
          <td className="sticky right-0 z-10 bg-white">
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
