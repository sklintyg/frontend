import { render, screen } from '@testing-library/react'
import { EmptyCertificateListInfo } from './EmptyCertificateListInfo'

it('Should display information if total above 0', () => {
  render(<EmptyCertificateListInfo total={1} />)
  expect(screen.getByText(/de filter du valt matchar inga av dina intyg/i)).toBeInTheDocument()
})

it('Should display information if total is 0', () => {
  render(<EmptyCertificateListInfo total={0} />)
  expect(screen.getByText(/om du saknar ett intyg, vänd dig till din mottagning/i)).toBeInTheDocument()
})
