import { TextSearchFilter } from '../../../../components/Table/filter/TextSearchFilter'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { update } from '../../../../store/slices/luCertificatesFilter.slice'

export function LUCertificateSearchFilter() {
  const searchText = useAppSelector((state) => state.luCertificatesFilter.filter.searchText)
  const dispatch = useAppDispatch()

  return (
    <TextSearchFilter
      title="Fritextsökning"
      description="Filtrerar på all synlig text och personnummer i tabellen"
      onTextSearchChange={(text) => dispatch(update({ searchText: text }))}
      placeholder="Hitta läkarutlåtanden som innehåller..."
      textValue={searchText}
    />
  )
}
