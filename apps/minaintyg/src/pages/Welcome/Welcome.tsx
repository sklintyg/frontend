import { IDSButton, IDSContainer, IDSSpinner } from '@inera/ids-react'
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
        <IDSButton secondary onClick={() => setDarkMode((d) => !d)}>
          {darkMode ? 'Light mode' : 'Dark mode'}
        </IDSButton>
      </div>
      {isLoading && <IDSSpinner />}
      {persons && <FakeLoginForm persons={persons} />}
    </IDSContainer>
  )
}
