import { render } from '@testing-library/react'
import { ScrollTopButton } from './ScrollTopButton'

it('Should render as expected', () => {
  const { container } = render(<ScrollTopButton />)
  expect(container).toMatchSnapshot()
})
