import { IDSButton, IDSContainer, IDSIconUser, IDSIconQuestion } from '@frontend/ids-react-ts'
import { differenceInDays, isBefore, parseISO, subDays } from 'date-fns'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Patient } from '../../../schemas/patientSchema'
import { RootState } from '../../../store/store'
import { TooltipIcon } from '../../../components/TooltipIcon/TooltipIcon'

export function PatientHeader({ patient }: { patient: Patient }) {
  const navigate = useNavigate()
  const isDateBeforeToday = (date: string) => isBefore(new Date(date), subDays(Date.now(), 1))
  const currentSickness = patient.sjukfallList.find(({ slut }) => !isDateBeforeToday(slut))
  const firstCertificate = patient.sjukfallList[0]?.intyg[0]
  const { showPersonalInformation } = useSelector((state: RootState) => state.settings)

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
                  <span className="font-bold">{differenceInDays(Date.now(), parseISO(currentSickness.start))} dagar </span>
                  <TooltipIcon
                    description="Visar antal dagar som sjukfallet pågått från första intygets startdatum till idag."
                    icon={<IDSIconQuestion size="s" className="ml-2" />}
                    alignMiddle
                  />
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
