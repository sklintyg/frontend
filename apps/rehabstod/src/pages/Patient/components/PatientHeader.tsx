import { IDSIcon, IDSButton } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { Patient } from '../../../schemas/patientSchema'

export function PatientHeader({ patient }: { patient: Patient }) {
  const navigate = useNavigate()
  const firstSickLeave = patient.sjukfallList[0]
  const lastSickLeave = patient.sjukfallList[patient.sjukfallList.length - 1]
  const firstCertificate = firstSickLeave ? firstSickLeave.intyg[0] : null

  const countSickDays = (startDate: Date, endDate: Date): number => {
    const today = new Date()
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysBeyondEnd = Math.max(0, Math.floor((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)))
    const daysSick = Math.max(0, daysSinceStart - daysBeyondEnd)
    return daysSick
  }

  const handleClick = () => {
    navigate('/pagaende-sjukfall')
  }

  return (
    <div className=" bg-neutral-99 sticky top-0">
      <div className="flex items-center space-x-2 p-4">
        <IDSIcon size="s" name="user" />
        {firstCertificate && (
          <div key={firstCertificate.patient.id} className="flex items-center space-x-2">
            <span className="font-bold">{firstCertificate.patient.namn},</span> <span>{firstCertificate.patient.id},</span>
            <span>{firstCertificate.patient.alder},</span> <span>{firstCertificate.patient.kon}</span>
            <span color="neutral-20" className="space-x-2">
              |
            </span>
            <span>
              Uppskattad dag i sjukfallet:{' '}
              <span className="font-bold">{countSickDays(new Date(firstSickLeave.start), new Date(lastSickLeave.slut))} dagar</span>
            </span>
          </div>
        )}

        <div className="grow" />
        <div>
          <IDSButton onClick={handleClick} tertiary>
            STÄNG PATIENTVYN
          </IDSButton>
        </div>
      </div>
    </div>
  )
}
