import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import { fakeCertificateListItem } from '../../faker/certificate/fakeCertificateListItem'
import { fakeListConfig } from '../../faker/list/fakeListConfig'
import { fakeTextFilter } from '../../faker/list/fakeListFilterConfig'
import { updateIsLoadingList, updateIsLoadingListConfig, updateTotalCount } from '../../store/list/listActions'
import store from '../../store/store'
import type { CertificateListItem, ListFilter } from '../../types'
import { ListType } from '../../types'
import { List } from './List'

const renderComponent = (list: CertificateListItem[], filter: ListFilter, totalCount = 1, isLoadingList = false) => {
  store.dispatch(updateTotalCount(totalCount))
  store.dispatch(updateIsLoadingList(isLoadingList))
  store.dispatch(updateIsLoadingListConfig(false))
  render(
    <Provider store={store}>
      <List
        config={fakeListConfig({
          title: 'title',
          filters: [
            fakeTextFilter({
              id: 'TEXT_FILTER',
              title: 'title',
              placeholder: 'test',
              description: 'description',
            }),
          ],
        })}
        list={list}
        filter={filter}
        title="TITLE"
        icon="icon"
        type={ListType.DRAFTS}
      />
    </Provider>
  )
}

describe('List', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    store.dispatch(updateIsLoadingList(false))
  })

  it('should display title', () => {
    renderComponent([], { type: ListType.UNKOWN, values: {} }, 10)
    expect(screen.getByText('TITLE')).toBeInTheDocument()
  })

  it('should no results if filter results in empty list', () => {
    renderComponent([], { type: ListType.UNKOWN, values: {} }, 10)
    expect(screen.getByText('Inga resultat att visa.')).toBeInTheDocument()
  })

  it('should show reset button', () => {
    renderComponent([fakeCertificateListItem()], { type: ListType.UNKOWN, values: {} })
    expect(screen.getByText('Återställ sökfilter', { exact: false })).toBeInTheDocument()
  })

  it('should show search button', () => {
    renderComponent([fakeCertificateListItem()], { type: ListType.UNKOWN, values: {} })
    expect(screen.getByText('Sök')).toBeInTheDocument()
  })

  it('should not display pagination if filtered list is empty', () => {
    renderComponent([], { type: ListType.UNKOWN, values: {} }, 0)
    expect(screen.queryByText('Föregående', { exact: false })).not.toBeInTheDocument()
    expect(screen.queryByText('Visa antal träffar', { exact: false })).not.toBeInTheDocument()
  })

  it('should not display pagination if list is loading', () => {
    renderComponent([fakeCertificateListItem()], { type: ListType.UNKOWN, values: {} }, 1, true)
    expect(screen.queryByText('Föregående', { exact: false })).not.toBeInTheDocument()
    expect(screen.queryByText('Visa antal träffar', { exact: false })).not.toBeInTheDocument()
  })

  it('should display pagination if list is done loading', () => {
    renderComponent([fakeCertificateListItem()], { type: ListType.UNKOWN, values: {} }, 20)
    expect(screen.getByText('Föregående', { exact: false })).toBeInTheDocument()
  })
})
