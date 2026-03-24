import { IDSContainer, IDSDarkmodeToggle, IDSSpinner } from '@inera/ids-react'
import { useEffect, useState } from 'react'
import { useGetPersonsQuery } from '../../store/testabilityApi'
import { FakeLoginForm } from './components/FakeLoginForm'

export function Welcome() {
  const { data: persons, isLoading } = useGetPersonsQuery()
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('ids--light', !darkMode)
    document.body.classList.toggle('ids--dark', darkMode)
  }, [darkMode])

  return (
    <IDSContainer>
      <div className="flex justify-end py-2">
        <IDSDarkmodeToggle checked={darkMode} onChange={() => setDarkMode((d) => !d)} />
      </div>
      {isLoading && <IDSSpinner />}
      {persons && <FakeLoginForm persons={persons} />}
    </IDSContainer>
  )
}
