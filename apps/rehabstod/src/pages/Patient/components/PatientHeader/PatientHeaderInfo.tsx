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
    <div className="whitespace-nowrap text-sm sm:text-base">
      <span>{alder} år,</span> <span>{kon === 'F' ? 'kvinna' : 'man'}</span>
      {currentSickness && (
        <>
          <span className="mx-1">|</span>
          <span>
            Uppskattad dag i sjukfallet:{' '}
            <span className="font-bold">{differenceInDays(Date.now(), parseISO(currentSickness.start))} dagar </span>
            <TooltipIcon
              description="Visar antal dagar som sjukfallet pågått från första intygets startdatum till idag."
              icon={<Icon icon="information" className="ml-1 h-4 w-4 align-middle sm:ml-2 sm:h-5 sm:w-5" />}
              alignMiddle
            />
          </span>
        </>
      )}
    </div>
  )
}
