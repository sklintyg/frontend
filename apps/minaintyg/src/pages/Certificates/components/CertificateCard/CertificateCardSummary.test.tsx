import { render, screen } from '@testing-library/react'
import { CertificateListSummary } from '../../../../schema/certificateList.schema'
import { CertificateCardSummary } from './CertificateCardSummary'

it('Should render stuff', () => {
  const summary: CertificateListSummary = [['diagnos', 'Downs syndrom']]
  render(<CertificateCardSummary summary={summary} timestamp="2023-05-09T18:37:23.159Z" />)

  expect(screen.getByText('diagnos:')).toBeInTheDocument()
  expect(screen.getByText('Downs syndrom')).toBeInTheDocument()
  expect(screen.getByText('2023-05-09')).toBeInTheDocument()
})
