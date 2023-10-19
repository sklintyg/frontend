import { render } from '@testing-library/react'
import { PageHeading } from './PageHeading'

it('Should render correctly', () => {
  const { container } = render(<PageHeading heading="Test">Lorem ipsum</PageHeading>)
  expect(container).toMatchSnapshot()
})
