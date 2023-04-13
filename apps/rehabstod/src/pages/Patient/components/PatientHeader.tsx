import { IDSIcon } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { Patient } from '../../../schemas/patientSchema'

function countSickDays(startDate: Date, endDate: Date): number {
  const today = new Date() // get current date
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) // calculate number of days since first day of illness, rounding down
  const daysBeyondEnd = Math.max(0, Math.floor((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24))) // calculate number of days beyond last day of illness, rounding down and limiting to non-negative values
  const daysSick = Math.max(0, daysSinceStart - daysBeyondEnd) // calculate number of days sick, limiting to non-negative values
  return daysSick
}

export function PatientHeader({ patient }: { patient: Patient }) {
  return (
    <div color="var(--IDS-COLOR-NEUTRAL-99)" className="sticky top-0 z-50">
      <div className="flex items-center space-x-2 p-4">
        <Link to="/">STÄNG PATIENTVYN</Link>
        <IDSIcon name="user" />
        {patient.sjukfallList.map((sjukfall) =>
          sjukfall.intyg.map((intyg) => (
            <div key={intyg.patient.id} className="flex items-center space-x-2">
              <span>{intyg.patient.namn}</span>
              <span>{intyg.patient.id}</span>
              <span>{intyg.patient.alder}</span>
              <span>Uppskattad dag i sjukfallet: {countSickDays(new Date(intyg.start), new Date(intyg.slut))}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
