import * as React from 'react'
import { CertificateListItem, ListConfig, ListFilter, ListFilterValueText, PatientListInfo } from '@frontend/common/src/types/list'
import ListFilterComponent from './ListFilterComponent'
import Table from '@frontend/common/src/components/Table/Table'
import PatientInfo from './PatientInfo'
import { CustomButton } from '@frontend/common'
import { useHistory } from 'react-router-dom'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { addValueToActiveListFilter } from '../../store/list/listActions'
import { useDispatch } from 'react-redux'

interface Props {
  config: ListConfig | undefined
  list: CertificateListItem[]
  filterValues: ListFilter
}

const List: React.FC<Props> = ({ config, list, filterValues }) => {
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
    console.log(listItem)
    return Object.keys(listItem).map((key) => getListItemContent(key, listItem))
  }

  const openCertificate = (id: string) => {
    history.push('/certificate/' + id)
  }

  const updateSortingOfList = (id: string) => {
    const orderBy: ListFilterValueText = {
      id: 'orderBy',
      value: id,
    }
    dispatch(addValueToActiveListFilter(orderBy))
  } //add ascending value update

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
          <PatientInfo info={listItem[key] as PatientListInfo} />
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
    if (filterValues) {
      const orderBy = filterValues.values.find((value) => value.id === 'orderBy')
      return orderBy ? orderBy : config.defaultOrderBy
    }
    return config.defaultOrderBy
  }

  const getAscending = () => {
    return filterValues && filterValues.values.find((value) => value.id === 'ascending')
  }

  return (
    <>
      {getFilter()}
      <Table
        caption={config.title}
        headings={config.tableHeadings}
        orderBy={getOrderBy()}
        ascending={getAscending()}
        onTableHeadClick={updateSortingOfList}>
        {getTable()}
      </Table>
    </>
  )
}

export default List
