import { ReactNode } from 'react'
import { PatientSjukfall } from '../../schemas/patientSchema'
import { PatientAccordion } from './PatientAccordion'

export function PatientDiagnosisAccordion({
  diagnos,
  dagar,
  children,
}: Pick<PatientSjukfall, 'diagnos' | 'dagar'> & { children: ReactNode }) {
  return (
    <PatientAccordion
      title={`${diagnos ? diagnos.kod : 'Okänd diagnos'} ${diagnos ? diagnos.beskrivning : ''} - sjukfallets längd ${dagar} dagar`}
    >
      {children}
    </PatientAccordion>
  )
}
