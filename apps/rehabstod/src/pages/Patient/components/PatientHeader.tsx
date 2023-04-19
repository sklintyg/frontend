import { IDSIcon, IDSButton, IDSContainer } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { formatDuration, intervalToDuration, isBefore, subDays } from 'date-fns'
import { Patient } from '../../../schemas/patientSchema'

export function PatientHeader({ patient }: { patient: Patient }) {
  const navigate = useNavigate()
  const isDateBeforeToday = (date: string) => isBefore(new Date(date), subDays(Date.now(), 1))
  const currentSickness = patient.sjukfallList.find(({ slut }) => !isDateBeforeToday(slut))
  const firstCertificate = currentSickness ? currentSickness.intyg[0] : null

  const handleClick = () => {
    navigate('/pagaende-sjukfall')
  }

  return (
    <div className="bg-secondary-95 sticky top-0">
      <IDSContainer>
        <div className="flex items-center space-x-2 py-4">
          <IDSIcon size="s" name="user" />
          {firstCertificate && currentSickness && (
            <div key={firstCertificate.patient.id} className="flex items-center space-x-2">
              <span className="font-bold">{firstCertificate.patient.namn},</span> <span>{firstCertificate.patient.id},</span>
              <span>{firstCertificate.patient.alder},</span> <span>{firstCertificate.patient.kon}</span>
              <span color="neutral-20" className="space-x-2">
                |
              </span>
              <span>
                Uppskattad dag i sjukfallet:{' '}
                <span className="font-bold">
                  {formatDuration(
                    intervalToDuration({
                      start: new Date(currentSickness.start),
                      end: new Date(),
                    }),
                    {
                      format: ['years', 'days'],
                    }
                  )}{' '}
                </span>
              </span>
            </div>
          )}

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
