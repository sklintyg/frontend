import { IDSTab, IDSTabPanel, IDSTabs } from '@inera/ids-react'
import { useState } from 'react'
import { PatientLUCertificatesTable } from './patientLU/PatientLUCertificatesTable'
import { PatientSickLeaves } from './patientSickLeaves/PatientSickLeaves'

export function PatientTabs({ active }: { active: number }) {
  const [activeTab, setActiveTab] = useState(active)

  return (
    <IDSTabs onTabChange={setActiveTab}>
      <IDSTab label="Sjukfall" />
      <IDSTab label="Läkarutlåtanden" />
      <IDSTabPanel noFocus>{activeTab === 0 && <PatientSickLeaves />}</IDSTabPanel>
      <IDSTabPanel noFocus>{activeTab === 1 && <PatientLUCertificatesTable />}</IDSTabPanel>
    </IDSTabs>
  )
}
