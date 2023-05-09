import { Lakare } from '../../../schemas/lakareSchema'
import { DiagnosKapitel } from '../../../schemas/sickLeaveSchema'
import { useGetPopulatedFiltersQuery } from '../../../store/api'
import { useAppSelector } from '../../../store/hooks'
import { TimePeriodMetric, TimePeriodOption } from './filter/TimePeriodFilter'

const getDiagnosisText = (selected: DiagnosKapitel[]) => {
  if (selected.length === 0) {
    return '-'
  }

  if (selected.length === 1) {
    return `${selected[0].id}: ${selected[0].name} `
  }

  return `${selected.length} valda`
}

const getDoctorsText = (selected: string[], doctors: Lakare[]) => {
  if (selected.length === 0) {
    return '-'
  }

  if (selected.length === 1) {
    const doctor = doctors.find((d) => d.hsaId === selected[0])
    return doctor ? doctor.namn : ''
  }

  return `${selected.length} valda`
}

const getSickLeaveLengthText = (selected: TimePeriodOption[]) => {
  const getLabel = ({ from, to, metric }: TimePeriodOption) => {
    const label = metric === TimePeriodMetric.DAYS ? 'dagar' : 'år'

    if (to && from) {
      return `${from}-${to} ${label}`
    }

    return `${!to ? `Över ${from}` : `Under ${to}`} ${label}`
  }

  if (selected.length === 0) {
    return '-'
  }

  if (selected.length === 1) {
    return getLabel(selected[0])
  }

  return `${selected.length} valda`
}

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
          {getDiagnosisText(filter.diagnosisChapters)}
        </div>
        {!isDoctor && (
          <div>
            <p className="font-bold">Läkare: </p>
            {getDoctorsText(filter.doctorIds, populatedFilters?.activeDoctors ?? [])}
          </div>
        )}
        <div>
          <p className="font-bold">Åldersspann: </p>
          {filter.fromPatientAge} - {filter.toPatientAge}
        </div>
        <div>
          <p className="font-bold">Sjukskrivningslängd: </p>
          {getSickLeaveLengthText(
            sickLeaveLengthIntervals.filter((option) =>
              filter.sickLeaveLengthIntervals.find(({ from, to }) => from === option.from && to === option.to)
            )
          )}
        </div>
      </div>
    </div>
  )
}
