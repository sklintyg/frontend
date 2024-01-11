import { render } from '@testing-library/react'
import { expect, it } from 'vitest'
import { CertificateCardSummary } from './CertificateCardSummary'

it('Should render correctly with summary', () => {
  const { container } = render(
    <CertificateCardSummary
      summary={{ label: 'Gäller intygsperiod', value: '2023-05-09 - 2023-06-23' }}
      timestamp="2023-05-09T18:37:23.159Z"
    />
  )
  expect(container).toMatchSnapshot()
})

it('Should render correctly without summary', () => {
  const { container } = render(<CertificateCardSummary summary={undefined} timestamp="2023-05-09T18:37:23.159Z" />)
  expect(container).toMatchSnapshot()
})
