import { render, screen } from '@testing-library/react'
import React from 'react'
import List from '../List'
import { getConfigWithTextFilter } from './listTestUtils'
import { CertificateListItem, ListFilter } from '@frontend/common/src/types/list'
import store from '../../../store/store'
import { Provider } from 'react-redux'
import { updateTotalCount } from '../../../store/list/listActions'

const renderComponent = (list: CertificateListItem[], filter: ListFilter) => {
  render(
    <Provider store={store}>
      <List config={getConfigWithTextFilter()} list={list} filter={filter} />
    </Provider>
  )
}

describe('List', () => {
  it('should no results if filter results in empty list', () => {
    renderComponent([], {})
    store.dispatch(updateTotalCount(10))
    expect(screen.getByText('Inga resultat att visa.')).toBeInTheDocument()
  })

  it('should show reset button', () => {
    renderComponent([], {})
    expect(screen.getByText('Återställ sökfiltret', { exact: false })).toBeInTheDocument()
  })

  it('should display list values', () => {
    renderComponent([], {})
    expect(screen.getByText('Återställ sökfiltret', { exact: false })).toBeInTheDocument()
  })
})
