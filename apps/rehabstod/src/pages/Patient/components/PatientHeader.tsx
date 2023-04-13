import { IDSIcon, IDSLink } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { Patient } from '../../../schemas/patientSchema'

function countSickDays(startDate: Date, endDate: Date): number {
  const today = new Date()
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysBeyondEnd = Math.max(0, Math.floor((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)))
  const daysSick = Math.max(0, daysSinceStart - daysBeyondEnd)
  return daysSick
}

export function PatientHeader({ patient }: { patient: Patient }) {
  return (
    <div className=" bg-neutral-99 sticky top-0 z-50">
      <div className="flex items-center space-x-2 p-4">
        <IDSIcon size="s" name="user" />
        {patient.sjukfallList.map((sjukfall) =>
          sjukfall.intyg.map((intyg) => (
            <div key={intyg.patient.id} className="flex items-center space-x-2">
              <span className="font-bold">{intyg.patient.namn},</span>
              <span>{intyg.patient.id},</span>
              <span>{intyg.patient.alder},</span>
              <span>{intyg.patient.kon}</span>
              <span color="neutral-20" className="space-x-2">
                |
              </span>
              <span>
                Uppskattad dag i sjukfallet: <span className="font-bold">{countSickDays(new Date(intyg.start), new Date(intyg.slut))}</span>
              </span>
            </div>
          ))
        )}
        <div className="grow" />
        <div>
          <IDSLink>
            <Link to="/pagaende-sjukfall">STÄNG PATIENTVYN</Link>
          </IDSLink>
        </div>
      </div>
    </div>
  )
}
