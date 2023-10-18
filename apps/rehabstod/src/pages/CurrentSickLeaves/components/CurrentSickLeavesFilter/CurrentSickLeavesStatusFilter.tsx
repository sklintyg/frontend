import { MultipleSelectFilterOption } from '../../../../components/Table/filter/MultipleSelectFilterOption'
import { getMultipleSelectPlaceholder } from '../../../../components/Table/filter/utils/getMultipleSelectPlaceholder'
import { RekoStatusType } from '../../../../schemas/sickLeaveSchema'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slices/sickLeaveFilter.slice'

export function CurrentSickLeavesStatusFilter({ options }: { options: RekoStatusType[] }) {
  const rekoStatusTypeIds = useAppSelector((state) => state.sickLeaveFilter.filter.rekoStatusTypeIds)
  const dispatch = useAppDispatch()

  return (
    <MultipleSelectFilterOption
      label="Status"
      onChange={(values) => dispatch(update({ rekoStatusTypeIds: values }))}
      options={options}
      selected={rekoStatusTypeIds}
      description="Filtrerar på den status som satts för patienten."
      placeholder={getMultipleSelectPlaceholder(rekoStatusTypeIds, options)}
    />
  )
}
