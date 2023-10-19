import { MultipleSelectFilterOption } from '../../../../components/Table/filter/MultipleSelectFilterOption'
import { getMultipleSelectPlaceholder } from '../../../../components/Table/filter/utils/getMultipleSelectPlaceholder'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slices/luCertificatesFilter.slice'

const certificateFilterTypes = [
  { name: 'Läkarutlåtande för sjukersättning, FK7800', id: 'FK7800' },
  { name: 'Läkarutlåtande för aktivitetsersättning vid nedsatt arbetsförmåga, FK7801', id: 'FK7801' },
  { name: 'Läkarutlåtande för aktivitetsersättning vid förlängd skolgång, FK7802', id: 'FK7802' },
]

export function LUCertificateTypeFilter() {
  const { filter } = useAppSelector((state) => state.luCertificatesFilter)
  const dispatch = useAppDispatch()

  return (
    <MultipleSelectFilterOption
      label="Läkarutlåtande"
      onChange={(values) => dispatch(update({ certTypes: values }))}
      options={certificateFilterTypes}
      selected={filter.certTypes}
      description="Filtrerar på typ av läkarutlåtande."
      placeholder={getMultipleSelectPlaceholder(filter.certTypes, certificateFilterTypes)}
    />
  )
}
