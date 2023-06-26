import { IDSTab, IDSTabs, IDSTabPanel } from '@frontend/ids-react-ts'
import { PatientSickLeaves } from './components/patientSickLeaves/PatientSickLeaves'

export function PatientTabs() {
  return (
    <IDSTabs>
      <IDSTab label="Sjukfall" />
      <IDSTab label="Läkarutlåtanden" />
      <IDSTabPanel>
        <PatientSickLeaves />
      </IDSTabPanel>
      <IDSTabPanel>
        <p>Alla läkarutlåtanden</p>
      </IDSTabPanel>
    </IDSTabs>
  )
}
