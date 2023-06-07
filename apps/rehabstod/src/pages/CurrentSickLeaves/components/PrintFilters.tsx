import { parseDate } from '@internationalized/date'
import { useGetPopulatedFiltersQuery } from '../../../store/api'
import { useAppSelector } from '../../../store/hooks'
import { getSickLeaveLengthLabel } from '../utils/getSickLeaveLengthPlaceholder'
import { convertSelectedValue } from '../utils/timePeriodConversion'

export function PrintFilters({ isDoctor }: { isDoctor: boolean }) {
  const { data: populatedFilters } = useGetPopulatedFiltersQuery()
  const { filter, sickLeaveLengthIntervals } = useAppSelector((state) => state.sickLeave)
  const sickLeaveRange =
    filter.fromSickLeaveEndDate && filter.toSickLeaveEndDate
      ? { start: parseDate(filter.fromSickLeaveEndDate), end: parseDate(filter.toSickLeaveEndDate) }
      : null

  if (!populatedFilters) {
    return null
  }

  return (
    <div className="mb-5 hidden print:block">
      <h3 className="ids-heading-4">Valda filter</h3>
      <div
        className="bg-neutral-99 grid grid-cols-4 gap-2 rounded p-2"
        style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
        <div className="whitespace-pre-line">
          <p className="font-bold">Diagnos/er: </p>
          {filter.diagnosisChapters.length === 0
            ? 'Alla valda'
            : filter.diagnosisChapters.map((diagnosisChapter) => `${diagnosisChapter.id}: ${diagnosisChapter.name}\n`)}
        </div>
        {!isDoctor && (
          <div className="whitespace-pre-line">
            <p className="font-bold">Läkare: </p>
            {filter.doctorIds.length === 0
              ? 'Alla valda'
              : populatedFilters.activeDoctors
                  .filter((doctor) => filter.doctorIds.find((id) => doctor.hsaId === id))
                  .map((doctor) => `${doctor.hsaId}: ${doctor.namn}\n`)}
          </div>
        )}
        <div>
          <p className="font-bold">Slutdatum: </p>
          {sickLeaveRange ? (
            <span>
              {sickLeaveRange.start.toString()} - {sickLeaveRange.end.toString()}
            </span>
          ) : (
            '-'
          )}
        </div>
        <div>
          <p className="font-bold">Åldersspann: </p>
          {filter.fromPatientAge} - {filter.toPatientAge}
        </div>
        <div className="whitespace-pre-line">
          <p className="font-bold">Sjukskrivningslängd: </p>
          {sickLeaveLengthIntervals
            .filter((option) =>
              filter.sickLeaveLengthIntervals.find(
                ({ from, to }) =>
                  convertSelectedValue(from, option.metric) === option.from && convertSelectedValue(to, option.metric) === option.to
              )
            )
            .map((option) => `${getSickLeaveLengthLabel(option)}\n`) ?? 'Alla valda'}
        </div>
        <div className="whitespace-pre-line">
          <p className="font-bold">REKO-status: </p>
          {filter.rekoStatusTypeIds.length === 0
            ? 'Alla valda'
            : populatedFilters.rekoStatusTypes
                .filter((type) => filter.rekoStatusTypeIds.find((id) => type.id === id))
                .map((type) => `${type.name}\n`)}
        </div>
        <div className="whitespace-pre-line">
          <p className="font-bold">Sysselsättning: </p>
          {filter.occupationTypeIds.length === 0
            ? 'Alla valda'
            : populatedFilters.occupationTypes
                .filter((type) => filter.occupationTypeIds.find((id) => type.id === id))
                .map((type) => `${type.name}\n`)}
        </div>
      </div>
    </div>
  )
}
