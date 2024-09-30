import { IDSTab, IDSTabPanel, IDSTabs } from 'ids-react-ts'
import { useState } from 'react'
import { PatientLUCertificatesTable } from './patientLU/PatientLUCertificatesTable'
import { PatientSickLeaves } from './patientSickLeaves/PatientSickLeaves'

export function PatientTabs({ active }: { active: string }) {
  const [activeTab, setActiveTab] = useState(active)

  return (
    <IDSTabs activeTab={parseInt(activeTab, 10)} emitTabChange={setActiveTab}>
      <IDSTab label="Sjukfall" />
      <IDSTab label="Läkarutlåtanden" />
      <IDSTabPanel nofocus>{activeTab === '0' && <PatientSickLeaves />}</IDSTabPanel>
      <IDSTabPanel nofocus>{activeTab === '1' && <PatientLUCertificatesTable />}</IDSTabPanel>
    </IDSTabs>
  )
}
