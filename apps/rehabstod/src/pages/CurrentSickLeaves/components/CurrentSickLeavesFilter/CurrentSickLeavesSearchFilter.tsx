import { TextSearchFilter } from '../../../../components/Table/filter/TextSearchFilter'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slices/sickLeaveFilter.slice'

export function CurrentSickLeavesSearchFilter() {
  const textSearch = useAppSelector((state) => state.sickLeaveFilter.filter.textSearch)
  const dispatch = useAppDispatch()

  return (
    <TextSearchFilter
      title="Fritextsökning"
      description="Filtrerar på all synlig text och personnummer i tabellen"
      onTextSearchChange={(text: string) => dispatch(update({ textSearch: text }))}
      placeholder="Hitta sjukfall som innehåller..."
      textValue={textSearch}
    />
  )
}
