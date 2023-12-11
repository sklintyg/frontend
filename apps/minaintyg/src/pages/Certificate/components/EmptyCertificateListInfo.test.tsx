import { render } from '@testing-library/react'
import { EmptyCertificateListInfo } from './EmptyCertificateListInfo'

it('Should display information if total above 0', () => {
  const { container } = render(<EmptyCertificateListInfo total={1} />)
  expect(container).toMatchSnapshot()
})

it('Should display information if total is 0', () => {
  const { container } = render(<EmptyCertificateListInfo total={0} />)
  expect(container).toMatchSnapshot()
})
