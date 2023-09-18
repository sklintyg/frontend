import { render } from '@testing-library/react'
import { CertificateListSummary } from '../../../../schema/certificateList.schema'
import { CertificateCardSummary } from './CertificateCardSummary'

it('Should render correctly with summary', () => {
  const summary: CertificateListSummary = [
    ['intygsperiod', '2023-05-09 - 2023-06-23'],
    ['diagnos', 'Downs syndrom'],
  ]
  const { baseElement } = render(<CertificateCardSummary summary={summary} timestamp="2023-05-09T18:37:23.159Z" />)
  expect(baseElement).toMatchSnapshot()
})

it('Should render correctly without summary', () => {
  const { baseElement } = render(<CertificateCardSummary summary={[]} timestamp="2023-05-09T18:37:23.159Z" />)
  expect(baseElement).toMatchSnapshot()
})
