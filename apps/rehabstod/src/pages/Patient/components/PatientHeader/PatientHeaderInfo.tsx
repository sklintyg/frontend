import { Icon, TooltipIcon } from '@frontend/components'
import { differenceInDays, parseISO } from 'date-fns'
import type { PatientSjukfall, PatientSjukfallIntyg } from '../../../../schemas/patientSchema'

export function PatientHeaderInfo({
  firstCertificate: {
    patient: { alder, kon },
  },
  currentSickness,
}: {
  firstCertificate: PatientSjukfallIntyg
  currentSickness?: PatientSjukfall
}) {
  return (
    <div className="flex flex-col gap-1 text-sm sm:text-base xl:flex-row">
      <div>
        <span>{alder} år,</span> <span>{kon === 'F' ? 'kvinna' : 'man'}</span>
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
              icon={<Icon icon="information" className="ml-1 h-4 w-4 sm:ml-2 sm:h-5 sm:w-5" />}
              alignMiddle
            />
          </div>
        </>
      )}
    </div>
  )
}
