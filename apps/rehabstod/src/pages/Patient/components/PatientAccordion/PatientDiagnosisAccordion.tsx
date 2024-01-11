import { ReactNode } from 'react'
import { PatientAccordion } from './PatientAccordion'
import { PatientSjukfall } from '../../../../schemas/patientSchema'

export function PatientDiagnosisAccordion({
  diagnos,
  dagar,
  children,
  open = true,
}: Pick<PatientSjukfall, 'diagnos' | 'dagar'> & { open?: boolean; children: ReactNode }) {
  return (
    <PatientAccordion
      open={open}
      title={`${diagnos ? diagnos.kod : 'Okänd diagnos'} ${diagnos ? diagnos.beskrivning : ''} - sjukfallets längd ${dagar} dagar`}
    >
      {children}
    </PatientAccordion>
  )
}
