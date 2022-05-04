import { render, screen } from '@testing-library/react'
import React from 'react'
import ListPageSizeFilter from '../ListPageSizeFilter'
import { ListFilterPageSizeConfig, ListFilterType, ListFilterValueNumber } from '@frontend/common/src/types/list'

const onFilterChange = jest.fn()
const TITLE = 'title for filter pagesize'
const pageSizes = [10, 20, 50, 100]

const getFilterValue = (): ListFilterValueNumber => {
  return {
    type: ListFilterType.NUMBER,
    id: 'PAGESIZE',
    value: 10,
  }
}

const getFilterConfig = (pageSizes: number[]): ListFilterPageSizeConfig => {
  return {
    type: ListFilterType.PAGESIZE,
    id: 'PAGESIZE',
    title: TITLE,
    pageSizes: pageSizes,
  } as ListFilterPageSizeConfig
}

const renderComponent = (totalCount: number) => {
  render(
    <ListPageSizeFilter
      filter={getFilterConfig(pageSizes)}
      onFilterChange={onFilterChange}
      value={getFilterValue()}
      totalCount={totalCount}
    />
  )
}

const renderComponentWithNoPageSizes = (totalCount: number) => {
  render(
    <ListPageSizeFilter filter={getFilterConfig([])} onFilterChange={onFilterChange} value={getFilterValue()} totalCount={totalCount} />
  )
}

const renderComponentWithUndefinedConfig = (totalCount: number) => {
  render(<ListPageSizeFilter filter={undefined} onFilterChange={onFilterChange} value={getFilterValue()} totalCount={totalCount} />)
}

describe('ListPageSizeFilter', () => {
  it('should render title of filter', () => {
    renderComponent(100)
    expect(screen.getByText(TITLE)).toBeInTheDocument()
  })

  it('should have first page size as deault', () => {
    renderComponent(100)
    expect(screen.getByLabelText(TITLE)).toHaveValue(pageSizes[0].toString())
  })

  it('should render all page sizes and show all if total count is the same as highest', () => {
    renderComponent(100)
    const options = screen.queryAllByRole('option')
    expect(options).toHaveLength(pageSizes.length + 1)
  })

  it('should render all page sizes and show all if total count is the larger than highest', () => {
    renderComponent(120)
    const options = screen.queryAllByRole('option')
    expect(options).toHaveLength(pageSizes.length + 1)
  })

  it('should not render page sizes larger than total count', () => {
    renderComponent(20)
    const options = screen.queryAllByRole('option')
    expect(options).toHaveLength(3)
    expect(options[0]).toHaveValue(pageSizes[0].toString())
    expect(options[1]).toHaveValue(pageSizes[1].toString())
  })

  it('should not render filter if pageSizes is empty', () => {
    renderComponentWithNoPageSizes(100)
    expect(screen.queryByLabelText(TITLE)).not.toBeInTheDocument()
  })

  it('should not render filter if total count is less than smallest page size', () => {
    renderComponent(9)
    expect(screen.queryByLabelText(TITLE)).not.toBeInTheDocument()
  })

  it('should not render filter if total count is the same as the smallest page size', () => {
    renderComponent(10)
    expect(screen.queryByLabelText(TITLE)).not.toBeInTheDocument()
  })

  it('should not render filter if config is undefined', () => {
    renderComponentWithUndefinedConfig(100)
    expect(screen.queryByLabelText(TITLE)).not.toBeInTheDocument()
  })

  it('should render all option', () => {
    renderComponent(20)
    const options = screen.queryAllByRole('option')
    expect(options[1]).toHaveValue('20')
  })
})
