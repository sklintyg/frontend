import { IDSButton, IDSContainer } from '@frontend/ids-react-ts'
import { isBefore, subDays } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { PatientHeaderInfo } from './PatientHeaderInfo'
import { Patient } from '../../../../schemas/patientSchema'

export function PatientHeader({ patient }: { patient?: Patient }) {
  const navigate = useNavigate()
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

  return (
    <div className="z-30 order-1 bg-secondary-95 shadow-[0_2px_6px_0_rgba(0,0,0,0.15)]">
      <IDSContainer>
        <div className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
          {patient && <PatientHeaderInfo firstCertificate={firstCertificate} currentSickness={currentSickness} />}
          <IDSButton onClick={handleClick} tertiary>
            STÄNG PATIENTVYN
          </IDSButton>
        </div>
      </IDSContainer>
    </div>
  )
}
