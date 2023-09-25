import { render } from '@testing-library/react'
import { CertificateCardSummary } from './CertificateCardSummary'

it('Should render correctly with summary', () => {
  const { baseElement } = render(
    <CertificateCardSummary
      summary={{ label: 'Gäller intygsperiod', value: '2023-05-09 - 2023-06-23' }}
      timestamp="2023-05-09T18:37:23.159Z"
    />
  )
  expect(baseElement).toMatchSnapshot()
})

it('Should render correctly without summary', () => {
  const { baseElement } = render(<CertificateCardSummary summary={undefined} timestamp="2023-05-09T18:37:23.159Z" />)
  expect(baseElement).toMatchSnapshot()
})
