import styled from 'styled-components'
import DisplayError from '../../components/error/DisplayError'
import InfoBox from '../../components/utils/InfoBox'
import { getIsLoadingList, getIsSortingList, getListError } from '../../store/list/listSelectors'
import { useAppSelector } from '../../store/store'
import type { CertificateListItem, ListConfig, ListFilter, ListType, ResourceLink } from '../../types'
import { ListItemContent } from './ListItemContent'
import { ListTable } from './ListTable'
import ListFilterContainer from './filter/ListFilterContainer'
import ListPagination from './pagination/ListPagination'

const ContentWrapper = styled.div`
  width: 100%;
`

export function List({
  icon,
  config,
  list,
  filter,
  title,
}: Readonly<{
  config: ListConfig | undefined
  list: CertificateListItem[]
  filter: ListFilter | undefined
  title: string
  icon?: string
  type: ListType
}>) {
  const isLoadingList = useAppSelector(getIsLoadingList)
  const isSortingList = useAppSelector(getIsSortingList)
  const listError = useAppSelector(getListError)

  if (!config) {
    if (listError) {
      return (
        <InfoBox type="error">
          <DisplayError errorCode={listError?.errorCode} fallback="Sökningen kunde inte utföras." />
        </InfoBox>
      )
    }
    return null
  }

  return (
    <div className="iu-flex">
      {icon && <img src={icon} alt="" className="iu-mr-gutter iu-height-600" />}
      <ContentWrapper>
        <h3>{title}</h3>
        <ListFilterContainer config={config} filter={filter} />
        <ListTable
          caption={config.title}
          headings={config.tableHeadings}
          isLoadingContent={isLoadingList && !isSortingList}
          isEmptyList={list.length === 0}
          filter={filter}
          config={config}
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
        {(!isLoadingList || isSortingList) && <ListPagination />}
      </ContentWrapper>
    </div>
  )
}
