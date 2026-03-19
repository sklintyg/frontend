import { IDSDarkmodeToggle, IDSHeader1177Admin, IDSTab, IDSTabPanel, IDSTabs } from '@inera/ids-react'
import { useEffect, useState } from 'react'
import { FakeLogin } from './components/FakeLogin'
import { PatientData } from './components/PatientData'
import { TestData } from './components/TestData'

const DARK_MODE_KEY = 'ids-dark-mode'

export function Welcome() {
  const [activeTab, setActiveTab] = useState(0)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(DARK_MODE_KEY) === 'true')

  useEffect(() => {
    document.body.classList.toggle('ids--light', !darkMode)
    document.body.classList.toggle('ids--dark', darkMode)
    localStorage.setItem(DARK_MODE_KEY, String(darkMode))
  }, [darkMode])

  return (
    <>
      <IDSHeader1177Admin brandText="Rehabstöd" items={<IDSDarkmodeToggle checked={darkMode} onChange={() => setDarkMode((d) => !d)} />} />
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
