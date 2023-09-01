import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { certificateListItemSchema } from '../../../../schema/certificateList.schema'
import { CertificateCard } from './CertificateCard'

it('Should navigate to certificate from button', async () => {
  const certificate = fakerFromSchema(certificateListItemSchema)({ title: 'Certificate Title', certificateId: '1234', summary: [] })
  render(
    <MemoryRouter initialEntries={['/intyg']}>
      <Routes>
        <Route key="1" path="intyg" element={<CertificateCard {...certificate} />} />,
        <Route key="2" path="intyg/:id" element={<p>Some certificate page</p>} />,
      </Routes>
    </MemoryRouter>
  )
  expect(screen.getByRole('heading', { level: 3, name: 'Certificate Title' })).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Visa intyg' }))
  expect(screen.getByText('Some certificate page')).toBeInTheDocument()
})
