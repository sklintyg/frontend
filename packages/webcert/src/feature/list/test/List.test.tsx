import { render, screen } from '@testing-library/react'
import React from 'react'
import List from '../List'
import { getConfigWithTextFilter, getDefaultList } from './listTestUtils'
import { CertificateListItem, ListFilter, ListType } from '@frontend/common/src/types/list'
import store from '../../../store/store'
import { Provider } from 'react-redux'
import { updateIsLoadingList, updateIsLoadingListConfig, updateTotalCount } from '../../../store/list/listActions'

const renderComponent = (list: CertificateListItem[], filter: ListFilter, totalCount = 1, isLoadingList = false) => {
  store.dispatch(updateTotalCount(totalCount))
  store.dispatch(updateIsLoadingList(isLoadingList))
  store.dispatch(updateIsLoadingListConfig(false))
  render(
    <Provider store={store}>
      <List config={getConfigWithTextFilter()} list={list} filter={filter} title="TITLE" icon="icon" type={ListType.DRAFTS} />
    </Provider>
  )
}

describe('List', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    store.dispatch(updateIsLoadingList(false))
  })

  it('should display title', () => {
    renderComponent([], { type: ListType.UNKOWN }, 10)
    expect(screen.getByText('TITLE')).toBeInTheDocument()
  })

  it('should no results if filter results in empty list', () => {
    renderComponent([], { type: ListType.UNKOWN }, 10)
    expect(screen.getByText('Inga resultat att visa.')).toBeInTheDocument()
  })

  it('should show reset button', () => {
    renderComponent(getDefaultList(), { type: ListType.UNKOWN })
    expect(screen.getByText('Återställ sökfilter', { exact: false })).toBeInTheDocument()
  })

  it('should show search button', () => {
    renderComponent(getDefaultList(), { type: ListType.UNKOWN })
    expect(screen.getByText('Sök')).toBeInTheDocument()
  })

  it('should not display pagination if filtered list is empty', () => {
    renderComponent([], { type: ListType.UNKOWN }, 0)
    expect(screen.queryByText('Föregående', { exact: false })).not.toBeInTheDocument()
    expect(screen.queryByText('Visa antal träffar', { exact: false })).not.toBeInTheDocument()
  })

  it('should not display pagination if list is loading', () => {
    renderComponent(getDefaultList(), { type: ListType.UNKOWN }, 1, true)
    expect(screen.queryByText('Föregående', { exact: false })).not.toBeInTheDocument()
    expect(screen.queryByText('Visa antal träffar', { exact: false })).not.toBeInTheDocument()
  })

  it('should display pagination if list is done loading', () => {
    renderComponent(getDefaultList(), { type: ListType.UNKOWN }, 20)
    expect(screen.getByText('Föregående', { exact: false })).toBeInTheDocument()
  })
})
