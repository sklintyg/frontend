import { SelectFilter } from '../../../../components/Table/filter/SelectFilter'
import type { UnansweredCommunicationFilterType } from '../../../../schemas/sickLeaveSchema'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slices/sickLeaveFilter.slice'

export function CurrentSickLeavesQAFilter({ options }: { options: UnansweredCommunicationFilterType[] }) {
  const questionAndAnswers = useAppSelector((state) => state.sickLeaveFilter.filter.unansweredCommunicationFilterTypeId)
  const dispatch = useAppDispatch()

  return (
    <SelectFilter
      onChange={(id) => dispatch(update({ unansweredCommunicationFilterTypeId: id }))}
      options={options}
      description="Filtrerar på sjukfall med eller utan obesvarade kompletteringar eller administrativa frågor och svar."
      label="Ärendestatus"
      value={questionAndAnswers}
    />
  )
}
