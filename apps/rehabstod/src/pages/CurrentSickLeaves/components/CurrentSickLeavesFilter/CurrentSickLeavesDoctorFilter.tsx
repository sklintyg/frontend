import { DoctorFilter } from '../../../../components/Table/filter/DoctorFilter'
import { Lakare } from '../../../../schemas/lakareSchema'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slices/sickLeaveFilter.slice'

export function CurrentSickLeavesDoctorFilter({ options }: { options: Lakare[] }) {
  const doctorIds = useAppSelector((state) => state.sickLeaveFilter.filter.doctorIds)
  const dispatch = useAppDispatch()

  return (
    <DoctorFilter
      onChange={(Ids: string[]) => dispatch(update({ doctorIds: Ids }))}
      doctors={options}
      selected={doctorIds}
      description="Filtrerar på den läkare som har utfärdat det aktiva intyget. Endast läkare som utfärdat aktiva intyg visas i listan."
    />
  )
}
