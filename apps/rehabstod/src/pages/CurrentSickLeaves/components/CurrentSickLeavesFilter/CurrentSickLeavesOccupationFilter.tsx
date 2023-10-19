import { MultipleSelectFilterOption } from '../../../../components/Table/filter/MultipleSelectFilterOption'
import { getMultipleSelectPlaceholder } from '../../../../components/Table/filter/utils/getMultipleSelectPlaceholder'
import { OccupationType } from '../../../../schemas/sickLeaveSchema'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slices/sickLeaveFilter.slice'

export function CurrentSickLeavesOccupationFilter({ options }: { options: OccupationType[] }) {
  const occupationTypeIds = useAppSelector((state) => state.sickLeaveFilter.filter.occupationTypeIds)
  const dispatch = useAppDispatch()

  return (
    <MultipleSelectFilterOption
      label="Sysselsättning"
      onChange={(values) => dispatch(update({ occupationTypeIds: values }))}
      options={options}
      selected={occupationTypeIds}
      description="Filtrerar på patientens sysselsättning."
      placeholder={getMultipleSelectPlaceholder(occupationTypeIds, options)}
    />
  )
}
