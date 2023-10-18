import { fakerFromSchema } from '@frontend/fake'
import { render, screen, within } from '@testing-library/react'
import { ComponentProps } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { certificateMetadataSchema } from '../../../schema/certificate.schema'
import { CertificateList } from './CertificateList'

const fakeCertificate = fakerFromSchema(certificateMetadataSchema)

function renderComponent(props: ComponentProps<typeof CertificateList>) {
  return render(
    <MemoryRouter>
      <CertificateList {...props} />
    </MemoryRouter>
  )
}
describe('Group and sort by year', () => {
  const certificates = [
    fakeCertificate({ issued: '2021-01-01' }),
    fakeCertificate({ issued: '2022-01-01' }),
    fakeCertificate({ issued: '2023-01-01' }),
  ]

  it('Should sort certificates by year in descending order', () => {
    renderComponent({ certificates })

    const yearHeadings = screen.getAllByRole('heading', { level: 2 })
    expect(yearHeadings).toHaveLength(3)
    expect(yearHeadings[0]).toHaveTextContent('2023')
    expect(yearHeadings[1]).toHaveTextContent('2022')
    expect(yearHeadings[2]).toHaveTextContent('2021')
  })

  it('Should sort certificates by year in ascending order', () => {
    renderComponent({ certificates, order: 'ascending' })

    const yearHeadings = screen.getAllByRole('heading', { level: 2 })
    expect(yearHeadings).toHaveLength(3)
    expect(yearHeadings[0]).toHaveTextContent('2021')
    expect(yearHeadings[1]).toHaveTextContent('2022')
    expect(yearHeadings[2]).toHaveTextContent('2023')
  })
})

describe('Sort certificates', () => {
  const certificates = [
    fakeCertificate({ issued: '2022-01-01', name: 'Certificate A' }),
    fakeCertificate({ issued: '2022-02-02', name: 'Certificate B' }),
    fakeCertificate({ issued: '2022-02-01', name: 'Certificate C' }),
    fakeCertificate({ issued: '2023-01-01', name: 'Certificate D' }),
  ]

  it('Should sort certificates in descending order per year', () => {
    renderComponent({ certificates })

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
    renderComponent({ certificates, order: 'ascending' })

    const container = screen.getByTestId('2022-certificates')
    expect(container).toBeInTheDocument()

    const certificateHeadings = within(container).getAllByRole('heading', { level: 3 })
    expect(certificateHeadings).toHaveLength(3)
    expect(certificateHeadings[0]).toHaveTextContent('Certificate A')
    expect(certificateHeadings[1]).toHaveTextContent('Certificate C')
    expect(certificateHeadings[2]).toHaveTextContent('Certificate B')
  })
})
