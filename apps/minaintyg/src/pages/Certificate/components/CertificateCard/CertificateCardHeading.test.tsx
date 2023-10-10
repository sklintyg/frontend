import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { CertificateStatusEnum } from '../../../../schema/certificate.schema'
import { CertificateCardHeading } from './CertificateCardHeading'

function renderComponent() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route
          path="/"
          element={
            <CertificateCardHeading title="Foo" id="123" statuses={[CertificateStatusEnum.enum.NOT_SENT, CertificateStatusEnum.enum.NEW]} />
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

it('Should render correctly', () => {
  const { container } = renderComponent()
  expect(container).toMatchSnapshot()
})

it('Should sort status badges in correct order', () => {
  renderComponent()
  expect(Array.from(document.querySelectorAll('ids-badge')).map((el) => el.innerHTML)).toEqual(['Nytt', 'Ej skickat'])
})
