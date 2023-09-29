import { render } from '@testing-library/react'
import { FilterAccordion } from './FilterAccordion'

it('Should render as expected', () => {
  const { container } = render(
    <FilterAccordion listed={43} total={100} noun="intyg">
      <span>Test</span>
    </FilterAccordion>
  )
  expect(container).toMatchSnapshot()
})
