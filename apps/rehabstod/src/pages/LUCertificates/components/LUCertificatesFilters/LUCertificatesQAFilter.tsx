import { SelectFilter } from '../../../../components/Table/filter/SelectFilter'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slices/luCertificatesFilter.slice'

const options = [
  { name: 'Enbart läkarutlåtanden utan obesvarade ärenden', id: '1' },
  { name: 'Enbart läkarutlåtanden med obesvarade ärenden', id: '2' },
  { name: 'Läkarutlåtanden med obesvarade kompletteringar', id: '3' },
  { name: 'Läkarutlåtanden med obesvarade frågor och svar', id: '4' },
]

export function LUCertificateQAFilter() {
  const dispatch = useAppDispatch()
  const questionAndAnswers = useAppSelector((state) => state.luCertificatesFilter.filter.questionAndAnswers)

  return (
    <SelectFilter
      onChange={(id) => dispatch(update({ questionAndAnswers: Number(id) }))}
      options={options}
      description="Filtrerar på läkarutlåtanden med eller utan obesvarade kompletteringar eller administrativa frågor och svar."
      label="Ärendestatus"
      value={questionAndAnswers ?? ''}
    />
  )
}
