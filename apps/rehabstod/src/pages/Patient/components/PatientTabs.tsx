import { IDSTab, IDSTabPanel, IDSTabs } from '@inera/ids-react'
import { useState } from 'react'
import { PatientLUCertificatesTable } from './patientLU/PatientLUCertificatesTable'
import { PatientSickLeaves } from './patientSickLeaves/PatientSickLeaves'

export function PatientTabs({ active }: { active: number }) {
  const [activeTab, setActiveTab] = useState(active)

  return (
    <IDSTabs
      onTabChange={setActiveTab}
      tabs={[
        <IDSTab key="tab-1" label="Sjukfall" selected={activeTab === 0} />,
        <IDSTab key="tab-2" label="Läkarutlåtanden" selected={activeTab === 1} />,
      ]}
    >
      <IDSTabPanel noFocus>{activeTab === 0 && <PatientSickLeaves />}</IDSTabPanel>
      <IDSTabPanel noFocus>{activeTab === 1 && <PatientLUCertificatesTable />}</IDSTabPanel>
    </IDSTabs>
  )
}
