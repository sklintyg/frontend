import { render } from '@testing-library/react'
import { PageHeading } from './PageHeading'

it('Should render correctly', () => {
  const { baseElement } = render(<PageHeading heading="Test">Lorem ipsum</PageHeading>)
  expect(baseElement).toMatchSnapshot()
})
