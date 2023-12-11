import { render, screen } from '@testing-library/react'
import { FilterAccordion } from './FilterAccordion'

function renderComponent() {
  return render(
    <FilterAccordion listed={43} total={100} noun="intyg">
      <span>Test</span>
    </FilterAccordion>
  )
}

it('Should render as expected', () => {
  const { container } = renderComponent()
  expect(container).toMatchSnapshot()
})

it('Should render label', () => {
  renderComponent()
  expect(screen.getByText(`Visar 43 av 100 intyg`)).toBeInTheDocument()
})
