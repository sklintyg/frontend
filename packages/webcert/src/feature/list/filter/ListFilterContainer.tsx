import * as React from 'react'
import {
  ListConfig,
  ListFilter,
  ListFilterPageSizeConfig,
  ListFilterType,
  ListFilterValue,
  ListFilterValueNumber,
} from '@frontend/common/src/types/list'
import ListFilterComponent from './ListFilterComponent'
import { useDispatch, useSelector } from 'react-redux'
import ListFilterButtons from '../ListFilterButtons'
import { clearActiveListFilter, performListSearch, updateActiveListFilterValue } from '../../../store/list/listActions'
import styled from 'styled-components/macro'
import ListPageSizeFilter from '../ListPageSizeFilter'
import { isFilterValuesValid } from '../listUtils'
import { getActiveListFilterValue, getListTotalCount } from '../../../store/list/listSelectors'

const Root = styled.div`
  padding-top: 24px;
  padding-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
`

const FilterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
`

interface Props {
  config: ListConfig | undefined
  filter: ListFilter | undefined
}

const ListFilterContainer: React.FC<Props> = ({ config, filter }) => {
  const dispatch = useDispatch()
  const totalCount = useSelector(getListTotalCount)
  const pageSizeFilter = config?.filters.find((filter) => filter.type === ListFilterType.PAGESIZE) as ListFilterPageSizeConfig
  const pageSizeValue = useSelector(getActiveListFilterValue(pageSizeFilter ? pageSizeFilter.id : '')) as ListFilterValue

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
    dispatch(clearActiveListFilter())
  }

  const onUpdateList = (value: ListFilterValue, id: string) => {
    onFilterChange(value, id)
    onSearch()
  }

  const onFilterChange = (value: ListFilterValue, id: string) => {
    dispatch(updateActiveListFilterValue({ filterValue: value, id: id }))
  }

  return (
    <>
      <Root>
        <FilterWrapper>{getSelectFilter()}</FilterWrapper>
        <FilterWrapper>
          {getOtherFilter()}
          <ListFilterButtons
            searchTooltip={config.searchCertificateTooltip}
            onSearch={onSearch}
            onReset={onReset}
            isSearchEnabled={filter ? isFilterValuesValid(filter.values) : true}
          />
        </FilterWrapper>
      </Root>
      <ListPageSizeFilter
        filter={pageSizeFilter}
        value={pageSizeValue as ListFilterValueNumber}
        totalCount={totalCount}
        onFilterChange={onUpdateList}
      />
    </>
  )
}

export default ListFilterContainer
