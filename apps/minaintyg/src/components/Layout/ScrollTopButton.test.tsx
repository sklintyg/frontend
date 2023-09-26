import { render } from '@testing-library/react'
import { ScrollTopButton } from './ScrollTopButton'

it('Should render as expected', () => {
  const { baseElement } = render(<ScrollTopButton />)
  expect(baseElement).toMatchSnapshot()
})
