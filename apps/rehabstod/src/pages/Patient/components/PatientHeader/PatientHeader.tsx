import { Button } from '@frontend/components'
import { IDSHeaderPatient } from '@inera/ids-react'
import { isBefore, subDays } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import type { Patient } from '../../../../schemas/patientSchema'
import { useAppSelector } from '../../../../store/hooks'
import { PatientHeaderInfo } from './PatientHeaderInfo'

export function PatientHeader({ patient }: { patient?: Patient }) {
  const navigate = useNavigate()
  const showPersonalInformation = useAppSelector((state) => state.settings.showPersonalInformation)
  const isDateBeforeToday = (date: string) => isBefore(new Date(date), subDays(Date.now(), 1))
  const currentSickness = patient?.sjukfallList.find(({ slut }) => !isDateBeforeToday(slut))
  const firstCertificate = patient?.sjukfallList[0]?.intyg[0]

  function historyStateExists() {
    return window.history.state && window.history.state.idx > 0
  }

  const handleClick = () => {
    if (historyStateExists()) {
      navigate(-1)
    } else {
      navigate('/pagaende-sjukfall', { replace: true })
    }
  }

  if (!firstCertificate) {
    return null
  }

  const { id, namn } = firstCertificate.patient

  return (
    <IDSHeaderPatient
      className="[&_.ids-header-patient__content]:items-center [&_.ids-header-patient__id]:my-0"
      name={showPersonalInformation ? namn : undefined}
      ssn={showPersonalInformation ? id : undefined}
      srLabel="Patientinformation"
      buttons={
        <Button onClick={handleClick} tertiary>
          STÄNG PATIENTVYN
        </Button>
      }
    >
      {patient && <PatientHeaderInfo firstCertificate={firstCertificate} currentSickness={currentSickness} />}
    </IDSHeaderPatient>
  )
}
