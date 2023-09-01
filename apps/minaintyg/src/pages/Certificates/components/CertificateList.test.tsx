import { fakerFromSchema } from '@frontend/fake'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { certificateListItemSchema } from '../../../schema/certificateList.schema'
import { CertificateList } from './CertificateList'

const fakeCertificate = fakerFromSchema(certificateListItemSchema)

it('Should sort certificates by year in descending order', () => {
  const certificates = [
    fakeCertificate({ timestamp: '2021-01-01' }),
    fakeCertificate({ timestamp: '2022-01-01' }),
    fakeCertificate({ timestamp: '2023-01-01' }),
  ]

  render(
    <MemoryRouter>
      <CertificateList certificates={certificates} />
    </MemoryRouter>
  )

  const yearHeadings = screen.getAllByRole('heading', { level: 2 })
  expect(yearHeadings).toHaveLength(3)
  expect(yearHeadings[0]).toHaveTextContent('2023')
  expect(yearHeadings[1]).toHaveTextContent('2022')
  expect(yearHeadings[2]).toHaveTextContent('2021')

  // const certificateHeadings = screen.getAllByRole('heading', { level: 3 })
  // expect(certificateHeadings).toHaveLength(3)
  // expect(yearHeadings[0]).toHaveTextContent('2023')
  // expect(yearHeadings[1]).toHaveTextContent('2022')
  // expect(yearHeadings[2]).toHaveTextContent('2021')
})

it('Should sort certificates by year in ascending order', () => {
  const certificates = [
    fakeCertificate({ timestamp: '2021-01-01' }),
    fakeCertificate({ timestamp: '2022-01-01' }),
    fakeCertificate({ timestamp: '2023-01-01' }),
  ]

  render(
    <MemoryRouter>
      <CertificateList certificates={certificates} order="ascending" />
    </MemoryRouter>
  )

  const yearHeadings = screen.getAllByRole('heading', { level: 2 })
  expect(yearHeadings).toHaveLength(3)
  expect(yearHeadings[0]).toHaveTextContent('2021')
  expect(yearHeadings[1]).toHaveTextContent('2022')
  expect(yearHeadings[2]).toHaveTextContent('2023')
})

it('Should sort certificates in descending order per year', () => {
  const certificates = [
    fakeCertificate({ timestamp: '2022-01-01', title: 'Certificate A' }),
    fakeCertificate({ timestamp: '2022-02-02', title: 'Certificate B' }),
    fakeCertificate({ timestamp: '2022-02-01', title: 'Certificate C' }),
    fakeCertificate({ timestamp: '2023-01-01', title: 'Certificate D' }),
  ]

  render(
    <MemoryRouter>
      <CertificateList certificates={certificates} />
    </MemoryRouter>
  )

  const container = screen.getByTestId('2022-certificates')
  expect(container).toBeInTheDocument()
  expect(screen.getByTestId('2023-certificates')).toBeInTheDocument()
  expect(within(screen.getByTestId('2023-certificates')).getAllByRole('heading', { level: 3 })).toHaveLength(1)

  const certificateHeadings = within(container).getAllByRole('heading', { level: 3 })
  expect(certificateHeadings).toHaveLength(3)
  expect(certificateHeadings[0]).toHaveTextContent('Certificate B')
  expect(certificateHeadings[1]).toHaveTextContent('Certificate C')
  expect(certificateHeadings[2]).toHaveTextContent('Certificate A')
})

it('Should sort certificates in ascending order per year', () => {
  const certificates = [
    fakeCertificate({ timestamp: '2022-01-01', title: 'Certificate A' }),
    fakeCertificate({ timestamp: '2022-02-02', title: 'Certificate B' }),
    fakeCertificate({ timestamp: '2022-02-01', title: 'Certificate C' }),
    fakeCertificate({ timestamp: '2023-01-01', title: 'Certificate D' }),
  ]

  render(
    <MemoryRouter>
      <CertificateList certificates={certificates} order="ascending" />
    </MemoryRouter>
  )

  const container = screen.getByTestId('2022-certificates')
  expect(container).toBeInTheDocument()

  const certificateHeadings = within(container).getAllByRole('heading', { level: 3 })
  expect(certificateHeadings).toHaveLength(3)
  expect(certificateHeadings[0]).toHaveTextContent('Certificate A')
  expect(certificateHeadings[1]).toHaveTextContent('Certificate C')
  expect(certificateHeadings[2]).toHaveTextContent('Certificate B')
})
