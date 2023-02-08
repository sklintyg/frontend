import { CustomTooltip } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ListFilterButtons from '../ListFilterButtons'

const TOOLTIP_SEARCH = 'Tooltip for search button'
const TOOLTIP_RESET = 'Återställ sökfilter.'
const onSearch = jest.fn()
const onReset = jest.fn()

const renderComponent = (isSearchEnabled: boolean) => {
  render(
    <>
      <CustomTooltip />
      <ListFilterButtons
        searchTooltip={TOOLTIP_SEARCH}
        resetTooltip={TOOLTIP_RESET}
        isSearchEnabled={isSearchEnabled}
        onSearch={onSearch}
        onReset={onReset}
      />
    </>
  )
}

describe('ListFilterButtons', () => {
  it('should show search button', () => {
    renderComponent(true)
    expect(screen.getByText('Sök')).toBeInTheDocument()
  })

  it('should show reset button', () => {
    renderComponent(true)
    expect(screen.getByText('Återställ sökfilter', { exact: false })).toBeInTheDocument()
  })

  it('should show search tooltip', () => {
    renderComponent(true)
    userEvent.hover(screen.getByText('Sök'))
    expect(screen.getByText(TOOLTIP_SEARCH)).toBeInTheDocument()
  })

  it('should show reset tooltip', () => {
    renderComponent(true)
    userEvent.hover(screen.getByText('Återställ sökfilter'))
    expect(screen.getByText(TOOLTIP_RESET)).toBeInTheDocument()
  })

  it('should have search enabled if filter validates', () => {
    renderComponent(true)
    expect(screen.getByText('Sök')).toBeEnabled()
  })

  it('should have search disabled if filter does not validate', () => {
    renderComponent(false)
    expect(screen.getByText('Sök')).toBeDisabled()
  })

  it('should have search disabled if filter does not validate', () => {
    renderComponent(false)
    expect(screen.getByText('Sök')).toBeDisabled()
  })

  it('should perform search when clicking on button', () => {
    renderComponent(true)
    userEvent.click(screen.getByText('Sök'))
    expect(onSearch).toHaveBeenCalled()
    expect(onReset).not.toHaveBeenCalled()
  })

  it('should perform reset when clicking on button', () => {
    renderComponent(true)
    userEvent.click(screen.getByText('Återställ sökfilter'))
    expect(onReset).toHaveBeenCalled()
    expect(onSearch).not.toHaveBeenCalled()
  })
})
