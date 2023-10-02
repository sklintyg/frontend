import { render, screen } from '@testing-library/react'
import { FilterAccordion } from './FilterAccordion'

it('Should render as expected', () => {
  const { container } = render(
    <FilterAccordion listed={43} total={100} noun="intyg">
      <span>Test</span>
    </FilterAccordion>
  )
  expect(screen.getByText(`43 av 100 intyg`)).toBeInTheDocument()
  expect(container).toMatchSnapshot()
})
