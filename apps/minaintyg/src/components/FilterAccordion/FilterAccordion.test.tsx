import { render } from '@testing-library/react'
import { FilterAccordion } from './FilterAccordion'

it('Should render as expected', () => {
  const { container } = render(
    <FilterAccordion title="Headline">
      <span>Test</span>
    </FilterAccordion>
  )
  expect(container).toMatchSnapshot()
})
