import styled from 'styled-components'
import { performListSearch, updateActiveListFilterValue, updateDefaultListFilterValues } from '../../../store/list/listActions'
import { getActiveListFilterValue, getHasValidationErrors, getListTotalCount } from '../../../store/list/listSelectors'
import { useAppDispatch, useAppSelector } from '../../../store/store'
import type { ListConfig, ListFilter, ListFilterPageSizeConfig, ListFilterValue, ListFilterValueNumber } from '../../../types'
import { CertificateListItemValueType, ListFilterType } from '../../../types'
import ListFilterButtons from '../ListFilterButtons'
import ListPageSizeFilter from '../ListPageSizeFilter'
import { getTooltip } from '../listUtils'
import ListFilterComponent from './ListFilterComponent'

const Root = styled.div`
  padding-top: 24px;
  padding-bottom: 48px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
`

const FilterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-end;
`

function ListFilterContainer({ config }: Readonly<{ config: ListConfig | undefined; filter: ListFilter | undefined }>) {
  const dispatch = useAppDispatch()
  const totalCount = useAppSelector(getListTotalCount)
  const hasValidationErrors = useAppSelector(getHasValidationErrors)
  const pageSizeFilter = config?.filters.find((filter) => filter.type === ListFilterType.PAGESIZE) as ListFilterPageSizeConfig
  const pageSizeValue = useAppSelector(getActiveListFilterValue(pageSizeFilter ? pageSizeFilter.id : '')) as ListFilterValue

  if (!config) {
    return null
  }

  const getSelectFilter = () => {
    return config.filters.map(
      (filterConfig) =>
        filterConfig.type === ListFilterType.SELECT && (
          <ListFilterComponent key={filterConfig.id} config={filterConfig} onChange={onFilterChange} />
        )
    )
  }

  const hasSelectFilter = () => {
    if (!config) {
      return false
    }
    return config.filters.some((filterConfig) => filterConfig.type === ListFilterType.SELECT)
  }

  const getOtherFilter = () => {
    return config.filters.map(
      (filterConfig) =>
        filterConfig.type !== ListFilterType.SELECT && (
          <ListFilterComponent key={filterConfig.id} config={filterConfig} onChange={onFilterChange} />
        )
    )
  }

  const onSearch = () => {
    dispatch(performListSearch())
  }

  const onReset = () => {
    dispatch(updateDefaultListFilterValues(config))
  }

  const onUpdateList = (value: ListFilterValue, id: string) => {
    onFilterChange(value, id)
    onSearch()
  }

  const onFilterChange = (value: ListFilterValue, id: string) => {
    dispatch(updateActiveListFilterValue({ filterValue: value, id: id }))
    if (config.excludeFilterButtons) {
      onSearch()
    }
  }

  return (
    <>
      <Root>
        {hasSelectFilter() && <FilterWrapper>{getSelectFilter()}</FilterWrapper>}
        <FilterWrapper>
          {getOtherFilter()}
          {!config?.excludeFilterButtons && (
            <ListFilterButtons
              searchTooltip={getTooltip(config, CertificateListItemValueType.SEARCH_BUTTON)}
              resetTooltip={getTooltip(config, CertificateListItemValueType.RESET_BUTTON)}
              onSearch={onSearch}
              onReset={onReset}
              isSearchEnabled={!hasValidationErrors}
            />
          )}
        </FilterWrapper>
      </Root>
      <ListPageSizeFilter
        filter={pageSizeFilter}
        value={pageSizeValue as ListFilterValueNumber}
        totalCount={totalCount ?? 0}
        onFilterChange={onUpdateList}
        tableHasCaption={!!config.title}
      />
    </>
  )
}

export default ListFilterContainer
