import { IDSHeader1177Admin, IDSTab, IDSTabPanel, IDSTabs } from '@inera/ids-react'
import { useState } from 'react'
import { FakeLogin } from './components/FakeLogin'
import { PatientData } from './components/PatientData'
import { TestData } from './components/TestData'

export function Welcome() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <IDSHeader1177Admin brandText="Rehabstöd" />
      <div className="m-auto max-w-4xl px-3 py-2">
        <IDSTabs
          onTabChange={setActiveTab}
          tabs={[<IDSTab key="tab-1" label="Login" />, <IDSTab key="tab-2" label="Testdata" />, <IDSTab key="tab-3" label="Patientdata" />]}
        >
          <IDSTabPanel>{activeTab === 0 && <FakeLogin />}</IDSTabPanel>
          <IDSTabPanel>{activeTab === 1 && <TestData />}</IDSTabPanel>
          <IDSTabPanel>{activeTab === 2 && <PatientData />}</IDSTabPanel>
        </IDSTabs>
      </div>
    </>
  )
}
