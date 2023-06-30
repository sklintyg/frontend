import { IDSButton, IDSContainer, IDSIconUser } from '@frontend/ids-react-ts'
import { differenceInDays, isBefore, parseISO, subDays } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { Patient } from '../../../schemas/patientSchema'
import { useAppSelector } from '../../../store/hooks'

export function PatientHeader({ patient }: { patient: Patient }) {
  const navigate = useNavigate()
  const isDateBeforeToday = (date: string) => isBefore(new Date(date), subDays(Date.now(), 1))
  const currentSickness = patient.sjukfallList.find(({ slut }) => !isDateBeforeToday(slut))
  const firstCertificate = patient.sjukfallList[0]?.intyg[0]
  const { showPersonalInformation } = useAppSelector((state) => state.settings)

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
    <div className="bg-secondary-95 sticky top-0 z-30 shadow-[0_2px_6px_0_rgba(0,0,0,0.15)]">
      <IDSContainer>
        <div className="flex items-center space-x-2 py-4">
          <IDSIconUser size="s" />
          <div key={firstCertificate.patient.id} className="flex items-center space-x-2">
            {showPersonalInformation && <span className="font-bold">{firstCertificate.patient.namn},</span>}
            {showPersonalInformation && <span>{firstCertificate.patient.id},</span>}
            <span>{firstCertificate.patient.alder} år,</span> <span>{firstCertificate.patient.kon === 'F' ? 'kvinna' : 'man'}</span>
            {currentSickness && (
              <>
                <span color="neutral-20" className="space-x-2">
                  |
                </span>
                <span>
                  Uppskattad dag i sjukfallet:{' '}
                  <span className="font-bold">{differenceInDays(Date.now(), parseISO(currentSickness.start))} dagar</span>
                </span>
              </>
            )}
          </div>
          <div className="grow" />
          <div>
            <IDSButton onClick={handleClick} tertiary>
              STÄNG PATIENTVYN
            </IDSButton>
          </div>
        </div>
      </IDSContainer>
    </div>
  )
}
