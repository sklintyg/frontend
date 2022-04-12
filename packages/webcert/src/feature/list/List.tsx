import * as React from 'react'
import {
  CertificateListItem,
  CertificateListItemValueType,
  ListConfig,
  ListFilter,
  ListFilterOrderConfig,
  ListFilterType,
  PatientListInfo,
} from '@frontend/common/src/types/list'
import Table from '@frontend/common/src/components/Table/Table'
import { CustomButton, PatientListInfoContent } from '@frontend/common'
import { useHistory } from 'react-router-dom'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch, useSelector } from 'react-redux'
import { performListSearch, updateActiveListFilterValue } from '../../store/list/listActions'
import ListPagination from './pagination/ListPagination'
import { getIsLoadingList } from '../../store/list/listSelectors'
import ListFilterContainer from './filter/ListFilterContainer'

interface Props {
  config: ListConfig | undefined
  list: CertificateListItem[]
  filter: ListFilter | undefined
  title: string
}

const List: React.FC<Props> = ({ config, list, filter, title }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const isLoadingList = useSelector(getIsLoadingList)

  if (!config) {
    return null
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

  const getListContent = () => {
    return (
      <Table
        caption={config.title}
        headings={config.tableHeadings}
        orderBy={getOrderBy() as string}
        ascending={getAscending() as boolean}
        onTableHeadClick={updateSortingOfList}
        isLoadingContent={isLoadingList}
        isEmptyList={list.length === 0}>
        {getTable()}
      </Table>
    )
  }

  return (
    <>
      <h3 className="iu-pt-500">{title}</h3>
      <ListFilterContainer config={config} filter={filter} />
      {getListContent()}
      {!isLoadingList && <ListPagination />}
    </>
  )
}

export default List
