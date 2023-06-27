import { IDSTab, IDSTabs, IDSTabPanel } from '@frontend/ids-react-ts'
import { PatientSickLeaves } from './patientSickLeaves/PatientSickLeaves'
import { PatientLUCertificatesTable } from './patientLU/PatientLUCertificatesTable'

export function PatientTabs({ active }: { active: index }) {
  return (
    <IDSTabs>
      <IDSTab label="Sjukfall" selected={active === 0} />
      <IDSTab label="Läkarutlåtanden" selected={active === 1} />
      <IDSTabPanel>
        <PatientSickLeaves />
      </IDSTabPanel>
      <IDSTabPanel>
        <PatientLUCertificatesTable />
      </IDSTabPanel>
    </IDSTabs>
  )
}
