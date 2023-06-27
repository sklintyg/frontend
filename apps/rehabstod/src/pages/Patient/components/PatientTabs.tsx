import { IDSTab, IDSTabs, IDSTabPanel } from '@frontend/ids-react-ts'
import { PatientSickLeaves } from './patientSickLeaves/PatientSickLeaves'
import { PatientLUCertificatesTable } from './patientLU/PatientLUCertificatesTable'

export function PatientTabs({ active }: { active: number }) {
  return (
    <IDSTabs>
      <IDSTab label="Sjukfall" selected={active === 0} />
      <IDSTab label="Läkarutlåtanden" selected={active === 1} />
      <IDSTabPanel nofocus>
        <PatientSickLeaves />
      </IDSTabPanel>
      <IDSTabPanel nofocus>
        <PatientLUCertificatesTable />
      </IDSTabPanel>
    </IDSTabs>
  )
}
