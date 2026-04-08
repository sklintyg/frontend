import { IDSDarkmodeToggle, IDSHeader1177Admin, IDSTab, IDSTabPanel, IDSTabs } from '@inera/ids-react'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { updateDarkMode } from '../../store/slices/settings.slice'
import { FakeLogin } from './components/FakeLogin'
import { PatientData } from './components/PatientData'
import { TestData } from './components/TestData'

export function Welcome() {
  const [activeTab, setActiveTab] = useState(0)
  const dispatch = useAppDispatch()
  const darkMode = useAppSelector((state) => state.settings.darkMode)

  return (
    <>
      <IDSHeader1177Admin
        brandText="Rehabstöd"
        items={<IDSDarkmodeToggle checked={darkMode} onChange={() => dispatch(updateDarkMode(!darkMode))} />}
      />
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
