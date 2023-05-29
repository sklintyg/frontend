import { useGetPopulatedFiltersQuery } from '../../../store/api'
import { useAppSelector } from '../../../store/hooks'
import { getDiagnosisPlaceholder } from '../utils/getDiagnosisPlaceholder'
import { getDoctorsPlaceholder } from '../utils/getDoctorsPlaceholder'
import { getSickLeaveLengthPlaceholder } from '../utils/getSickLeaveLengthPlaceholder'
import { getRekoStatusPlaceholder } from '../utils/getRekoStatusPlaceholder'

export function PrintFilters({ isDoctor }: { isDoctor: boolean }) {
  const { data: populatedFilters } = useGetPopulatedFiltersQuery()
  const { filter, sickLeaveLengthIntervals } = useAppSelector((state) => state.sickLeave)

  return (
    <div className="mb-5 hidden print:block">
      <h3 className="ids-heading-4">Valda filter</h3>
      <div
        className="bg-neutral-99 grid grid-cols-4 gap-2 rounded p-2"
        style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
        <div>
          <p className="font-bold">Diagnos/er: </p>
          {getDiagnosisPlaceholder(filter.diagnosisChapters) ?? '-'}
        </div>
        {!isDoctor && (
          <div>
            <p className="font-bold">Läkare: </p>
            {getDoctorsPlaceholder(filter.doctorIds, populatedFilters?.activeDoctors ?? []) ?? '-'}
          </div>
        )}
        <div>
          <p className="font-bold">Åldersspann: </p>
          {filter.fromPatientAge} - {filter.toPatientAge}
        </div>
        <div>
          <p className="font-bold">Sjukskrivningslängd: </p>
          {getSickLeaveLengthPlaceholder(
            sickLeaveLengthIntervals.filter((option) =>
              filter.sickLeaveLengthIntervals.find(({ from, to }) => from === option.from && to === option.to)
            )
          ) ?? '-'}
        </div>
        <div>
          <p className="font-bold">REKO-status: </p>
          {getRekoStatusPlaceholder(filter.rekoStatuses, populatedFilters ? populatedFilters.rekoStatusTypes : []) ?? '-'}
        </div>
      </div>
    </div>
  )
}
