import { IDSIcon } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'
import { PatientSjukfall } from '../../../schemas/patientSchema'

export function PatientAccordion({ diagnos, dagar, children }: Pick<PatientSjukfall, 'diagnos' | 'dagar'> & { children: ReactNode }) {
  return (
    <details open className="group [&:not(:last-child)]:mb-5">
      <summary role="button" className="border-neutral-40 mb-2.5 flex cursor-pointer items-center space-x-2 border-b py-5">
        <h2 className="ids-heading-4 m-0 grow">{`${diagnos ? diagnos.kod : 'Okänd diagnos'} ${
          diagnos ? diagnos.beskrivning : ''
        } - sjukfallets längd ${dagar} dagar`}</h2>
        <span className="inline-block h-5 w-5 origin-center rotate-90 justify-self-end group-open:-rotate-90">
          <IDSIcon name="chevron" width="100%" height="100%" className="h-full w-full" />
        </span>
      </summary>
      {children}
    </details>
  )
}
