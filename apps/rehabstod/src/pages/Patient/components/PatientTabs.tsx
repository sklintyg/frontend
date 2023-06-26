import { IDSTab, IDSTabs, IDSTabPanel } from '@frontend/ids-react-ts'
import { PatientSickLeaves } from './patientSickLeaves/PatientSickLeaves'
import { PatientLuTable } from './patientLU/PatientLuTable'

export function PatientTabs() {
  return (
    <IDSTabs>
      <IDSTab label="Sjukfall" />
      <IDSTab label="Läkarutlåtanden" />
      <IDSTabPanel>
        <PatientSickLeaves />
      </IDSTabPanel>
      <IDSTabPanel>
        <PatientLuTable />
      </IDSTabPanel>
    </IDSTabs>
  )
}
