import { TooltipIcon } from '@frontend/components'
import { IDSIconQuestion, IDSIconUser } from '@frontend/ids-react-ts'
import { differenceInDays, parseISO } from 'date-fns'
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
  const showPersonalInformation = useAppSelector((state) => state.settings.showPersonalInformation)

  return (
    <div className="flex flex-col gap-1 text-sm sm:text-base xl:flex-row">
      <div>
        <IDSIconUser width="100%" height="100%" inline className="float-left mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />{' '}
        {showPersonalInformation && <span className="font-bold">{namn},</span>}{' '}
        <span className="whitespace-nowrap">
          {showPersonalInformation && <span>{id},</span>} <span>{alder} år,</span> <span>{kon === 'F' ? 'kvinna' : 'man'}</span>
        </span>
      </div>
      {currentSickness && (
        <>
          <div role="separator" color="neutral-20" className="hidden space-x-2 xl:inline-block">
            |
          </div>
          <div>
            Uppskattad dag i sjukfallet:{' '}
            <span className="font-bold">{differenceInDays(Date.now(), parseISO(currentSickness.start))} dagar </span>
            <TooltipIcon
              description="Visar antal dagar som sjukfallet pågått från första intygets startdatum till idag."
              icon={<IDSIconQuestion width="100%" height="100%" className="ml-1 h-4 w-4 sm:ml-2 sm:h-5 sm:w-5" />}
              alignMiddle
            />
          </div>
        </>
      )}
    </div>
  )
}
