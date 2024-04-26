import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { performListSearch, updateActiveListFilterValue, updateIsSortingList } from '../../store/list/listActions'
import { getIsLoadingList, getIsSortingList } from '../../store/list/listSelectors'
import { CertificateListItem, ListConfig, ListFilter, ListFilterType, ListType, ResourceLink } from '../../types'
import ListItemContent from './ListItemContent'
import { ListTable } from './ListTable'
import ListFilterContainer from './filter/ListFilterContainer'
import ListPagination from './pagination/ListPagination'

const ContentWrapper = styled.div`
  width: 100%;
`

interface Props {
  /** Config for this and sub-components. */
  config: ListConfig | undefined
  /** List of all values that rows that should be displayed */
  list: CertificateListItem[]
  /** All filter options that can be applied in the above list. */
  filter: ListFilter | undefined
  /** Title text. */
  title: string
  /** Specify what icon to use, otherwise undefined. */
  icon?: string
  /** what type of list that should be displayed.*/
  type: ListType
}

/**
 * Generates a table with filtering options and sorting.
 */
const List: React.FC<Props> = ({ icon, config, list, filter, title }) => {
  const dispatch = useDispatch()
  const isLoadingList = useSelector(getIsLoadingList)
  const isSortingList = useSelector(getIsSortingList)

  if (!config) {
    return null
  }

  const getOrderBy = () => {
    const val = filter && filter.values && filter.values['ORDER_BY']
    if (val && val.type === ListFilterType.TEXT) {
      return val.value ?? ''
    }
    return ''
  }

  const getAscending = () => {
    const val = filter && filter.values && filter.values['ASCENDING']
    if (val && val.type === ListFilterType.BOOLEAN) {
      return val.value
    }
    return false
  }

  const getUpdatedAscendingValue = (updatedOrderBy: string): boolean => {
    const isCurrentSorting = getOrderBy() === updatedOrderBy
    const defaultSortOrder = config.tableHeadings.find((heading) => heading.id === updatedOrderBy)?.defaultAscending
    if (isCurrentSorting) {
      return !getAscending()
    }
    return Boolean(defaultSortOrder)
  }

  const updateSortingOfList = (event: React.MouseEvent<HTMLTableCellElement>) => {
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

      dispatch(updateIsSortingList(true))
      dispatch(performListSearch)
    }
  }

  const getListContent = () => {
    return (
      <ListTable
        caption={config.title}
        headings={config.tableHeadings}
        orderBy={getOrderBy() as string}
        ascending={getAscending() as boolean}
        onTableHeadClick={updateSortingOfList}
        isLoadingContent={isLoadingList && !isSortingList}
        isEmptyList={list.length === 0}
      >
        {list.map((listItem, count) => (
          <tr key={'listItem-' + count}>
            {config.tableHeadings.map((heading) => {
              return (
                <ListItemContent
                  key={heading.id}
                  value={listItem.values[heading.id]}
                  valueType={heading.type}
                  tooltips={config.buttonTooltips}
                  links={listItem.values['LINKS'] as ResourceLink[]}
                  certificateId={listItem.values['CERTIFICATE_ID'] as string}
                />
              )
            })}
          </tr>
        ))}
      </ListTable>
    )
  }

  return (
    <>
      <div className="iu-flex">
        {icon && <img src={icon} alt="" className="iu-mr-gutter iu-height-600" />}
        <ContentWrapper>
          <h3>{title}</h3>
          <ListFilterContainer config={config} filter={filter} />
          {getListContent()}
          {(!isLoadingList || isSortingList) && <ListPagination />}
        </ContentWrapper>
      </div>
    </>
  )
}

export default List
