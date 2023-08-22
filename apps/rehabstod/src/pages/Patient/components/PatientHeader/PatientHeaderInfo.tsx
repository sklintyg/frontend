import { IDSIconQuestion, IDSIconUser } from '@frontend/ids-react-ts'
import { differenceInDays, parseISO } from 'date-fns'
import { TooltipIcon } from '../../../../components/TooltipIcon/TooltipIcon'
import { PatientSjukfall, PatientSjukfallIntyg } from '../../../../schemas/patientSchema'
import { useAppSelector } from '../../../../store/hooks'

export function PatientHeaderInfo({
  firstCertificate: {
    patient: { id, namn, alder, kon },
  },
  currentSickness,
}: {
  firstCertificate: PatientSjukfallIntyg
  currentSickness?: PatientSjukfall
}) {
  const { showPersonalInformation } = useAppSelector((state) => state.settings)

  return (
    <div className="flex flex-col gap-1 lg:flex-row">
      <div>
        <IDSIconUser size="s" inline className="float-left mr-2" /> {showPersonalInformation && <span className="font-bold">{namn},</span>}{' '}
        <span className="whitespace-nowrap">
          {showPersonalInformation && <span>{id},</span>} <span>{alder} år,</span> <span>{kon === 'F' ? 'kvinna' : 'man'}</span>
        </span>
      </div>
      {currentSickness && (
        <>
          <div role="separator" color="neutral-20" className="hidden space-x-2 lg:inline-block">
            |
          </div>
          <div>
            Uppskattad dag i sjukfallet:{' '}
            <span className="font-bold">{differenceInDays(Date.now(), parseISO(currentSickness.start))} dagar </span>
            <TooltipIcon
              description="Visar antal dagar som sjukfallet pågått från första intygets startdatum till idag."
              icon={<IDSIconQuestion size="s" className="ml-2" />}
              alignMiddle
            />
          </div>
        </>
      )}
    </div>
  )
}
