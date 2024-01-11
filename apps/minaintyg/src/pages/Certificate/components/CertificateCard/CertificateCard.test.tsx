import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { expect, it } from 'vitest'
import { CertificateCard } from './CertificateCard'
import { certificateMetadataSchema } from '../../../../schema/certificate.schema'

it('Should navigate to certificate from button', async () => {
  const certificate = fakerFromSchema(certificateMetadataSchema)({
    type: { name: 'Certificate Title' },
    id: '1234',
    summary: undefined,
  })
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route key="1" path="/" element={<CertificateCard {...certificate} />} />,
        <Route key="2" path="/:id" element={<p>Some certificate page</p>} />,
      </Routes>
    </MemoryRouter>
  )
  expect(screen.getByRole('heading', { level: 3, name: 'Certificate Title' })).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Visa intyg' }))
  expect(screen.getByText('Some certificate page')).toBeInTheDocument()
})
