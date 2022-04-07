import * as React from 'react'
import {
  CertificateListItem,
  CertificateListItemValueType,
  ListConfig,
  ListFilter,
  ListFilterOrderConfig,
  ListFilterPageSizeConfig,
  ListFilterType,
  ListFilterValue,
  ListFilterValueNumber,
  PatientListInfo,
} from '@frontend/common/src/types/list'
import ListFilterComponent from './ListFilterComponent'
import Table from '@frontend/common/src/components/Table/Table'
import PatientListInfoContent from './PatientListInfoContent'
import { CustomButton } from '@frontend/common'
import { useHistory } from 'react-router-dom'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch, useSelector } from 'react-redux'
import ListFilterButtons from './ListFilterButtons'
import { clearActiveListFilter, performListSearch, updateActiveListFilterValue } from '../../store/list/listActions'
import styled from 'styled-components/macro'
import ListPageSizeFilter from './ListPageSizeFilter'
import ListPagination from './pagination/ListPagination'
import { isFilterValuesValid } from './listUtils'
import { getActiveListFilterValue, getIsLoadingList, getListTotalCount } from '../../store/list/listSelectors'

interface Props {
  config: ListConfig | undefined
  list: CertificateListItem[]
  filter: ListFilter | undefined
}

const FilterWrapper = styled.div`
  padding-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
`

const List: React.FC<Props> = ({ config, list, filter }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const totalCount = useSelector(getListTotalCount)
  const isLoadingList = useSelector(getIsLoadingList)
  const pageSizeFilter = config?.filters.find((filter) => filter.type === ListFilterType.PAGESIZE) as ListFilterPageSizeConfig
  const pageSizeValue = useSelector(getActiveListFilterValue(pageSizeFilter ? pageSizeFilter.id : '')) as ListFilterValue

  if (!config) {
    return null
  }

  const getFilter = () => {
    if (!config) {
      return null
    }
    return config.filters.map((filterConfig) => (
      <ListFilterComponent key={filterConfig.id} config={filterConfig} onChange={onFilterChange} />
    ))
  }

  const getTable = () => {
    return list.map((listItem) => <tr>{getTableData(listItem)}</tr>)
  }

  const getTableData = (listItem: CertificateListItem) => {
    return config.tableHeadings.map((heading) => {
      return getListItemContent(heading.id, listItem.values[heading.id], heading.type)
    })
  }

  const openCertificate = (id: string) => {
    history.push('/certificate/' + id)
  }

  const getOpenCertificateButton = (certificateId: string) => {
    return (
      <td>
        <CustomButton
          tooltip={config ? config.openCertificateTooltip : ''}
          buttonStyle={'primary'}
          onClick={() => openCertificate(certificateId)}>
          Öppna
        </CustomButton>
      </td>
    )
  }

  const getListItemContent = (key: string, value: string | PatientListInfo | boolean, valueType: CertificateListItemValueType) => {
    switch (valueType) {
      case CertificateListItemValueType.TEXT:
        return <td>{value}</td>
      case CertificateListItemValueType.DATE:
        console.log(value.toString().split('T')[0])
        return <td>{value.toString().split('T')[0]}</td>
      case CertificateListItemValueType.PATIENT_INFO:
        return (
          <td>
            <PatientListInfoContent info={value as PatientListInfo} />
          </td>
        )
      case CertificateListItemValueType.OPEN_BUTTON:
        return getOpenCertificateButton(value as string)
      case CertificateListItemValueType.FORWARD:
        return value ? (
          <td>
            <FontAwesomeIcon icon={faCheck} className={`iu-color-main`} size="1x" />
          </td>
        ) : (
          <td />
        )
      case CertificateListItemValueType.HIDDEN:
      default:
        return <></>
    }
  }

  const getOrderBy = () => {
    return filter && filter.values && filter.values['ORDER_BY'] ? filter.values['ORDER_BY'].value : ''
  }

  const getAscending = () => {
    return filter && filter.values && filter.values['ASCENDING'] && filter.values['ASCENDING'].value
  }

  const getUpdatedAscendingValue = (updatedOrderBy: string) => {
    const defaultOrderBy = config.filters.find((filter) => filter.type === ListFilterType.ORDER) as ListFilterOrderConfig
    const isDefaultOrderBy = updatedOrderBy === defaultOrderBy.defaultValue
    const shouldToggleAscending = updatedOrderBy === getOrderBy()
    if (shouldToggleAscending) {
      return !getAscending()
    }
    return !isDefaultOrderBy
  }

  const updateSortingOfList = (event: React.MouseEvent<HTMLTableHeaderCellElement>) => {
    if (event.currentTarget.innerHTML) {
      dispatch(
        updateActiveListFilterValue({
          filterValue: { type: ListFilterType.ORDER, value: event.currentTarget.id },
          id: 'ORDER_BY',
        })
      )

      dispatch(
        updateActiveListFilterValue({
          filterValue: { type: ListFilterType.BOOLEAN, value: getUpdatedAscendingValue(event.currentTarget.id) },
          id: 'ASCENDING',
        })
      )

      dispatch(performListSearch)
    }
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

  const getListContent = () => {
    return (
      <Table
        caption={config.title}
        headings={config.tableHeadings}
        orderBy={getOrderBy() as string}
        ascending={getAscending() as boolean}
        onTableHeadClick={updateSortingOfList}
        isLoadingContent={isLoadingList}
        isEmptyList={totalCount > 0 && list.length === 0}>
        {getTable()}
      </Table>
    )
  }

  return (
    <>
      <FilterWrapper>{getFilter()}</FilterWrapper>
      <ListFilterButtons
        searchTooltip={config.searchCertificateTooltip}
        onSearch={onSearch}
        onReset={onReset}
        isSearchEnabled={filter ? isFilterValuesValid(filter.values) : true}
      />
      <ListPageSizeFilter
        filter={pageSizeFilter}
        value={pageSizeValue as ListFilterValueNumber}
        totalCount={totalCount}
        onFilterChange={onUpdateList}
      />
      {getListContent()}
      <ListPagination />
    </>
  )
}

export default List
