import * as React from 'react'
import {
  CertificateListItem,
  ListConfig,
  ListFilter,
  ListFilterOrderConfig,
  ListFilterType,
  PatientListInfo,
} from '@frontend/common/src/types/list'
import ListFilterComponent from './ListFilterComponent'
import Table from '@frontend/common/src/components/Table/Table'
import PatientListInfoContent from './PatientListInfoContent'
import { CustomButton } from '@frontend/common'
import { useHistory } from 'react-router-dom'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch } from 'react-redux'
import ListFilterButtons from './ListFilterButtons'
import { performListSearch, updateActiveListFilterValue } from '../../store/list/listActions'
import styled from 'styled-components/macro'
import ListPageSizeFilter from './ListPageSizeFilter'
import ListPagination from './pagination/ListPagination'

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

  if (!config) {
    return null
  }

  const getFilter = () => {
    if (!config) {
      return null
    }
    return config.filters.map((filterConfig) => <ListFilterComponent config={filterConfig} />)
  }

  const getTable = () => {
    return list.map((listItem) => <tr>{getTableData(listItem)}</tr>)
  }

  const getTableData = (listItem: CertificateListItem) => {
    return Object.keys(listItem).map((key) => getListItemContent(key, listItem))
  }

  const openCertificate = (id: string) => {
    history.push('/certificate/' + id)
  }

  const getOpenCertificateButton = (listItem: CertificateListItem, key: string) => {
    return (
      <td>
        <CustomButton
          tooltip={config ? config.openCertificateTooltip : ''}
          buttonStyle={'primary'}
          onClick={() => openCertificate(listItem[key] as string)}>
          Öppna
        </CustomButton>
      </td>
    )
  }

  const getListItemContent = (key: string, listItem: CertificateListItem) => {
    if (key === 'patientListInfo') {
      return (
        <td>
          <PatientListInfoContent info={listItem[key] as PatientListInfo} />
        </td>
      )
    } else if (key === 'certificateId') {
      return getOpenCertificateButton(listItem, key)
    } else if (key === 'certificateType') {
      return
    } else if (typeof listItem[key] === 'boolean') {
      return listItem[key] ? (
        <td>
          <FontAwesomeIcon icon={faCheck} className={`iu-color-main`} size="1x" />
        </td>
      ) : (
        <td />
      )
    } else if (typeof listItem[key] === 'string') {
      const textValue = listItem[key] as string
      if (Date.parse(textValue)) {
        return <td>{textValue.split('T')[0]}</td>
      }
      return <td>{textValue}</td>
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

  return (
    <>
      <FilterWrapper>{getFilter()}</FilterWrapper>
      <ListFilterButtons
        searchTooltip={config.searchCertificateTooltip}
        filterConfig={config.filters}
        listFilterValues={filter ? filter.values : undefined}
      />
      <ListPageSizeFilter filter={config.filters.find((filter) => filter.type === ListFilterType.PAGESIZE)} />
      <Table
        caption={config.title}
        headings={config.tableHeadings}
        orderBy={getOrderBy() as string}
        ascending={getAscending() as boolean}
        onTableHeadClick={updateSortingOfList}>
        {getTable()}
      </Table>
      <ListPagination />
    </>
  )
}

export default List
