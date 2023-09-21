import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { CertificateStatusEnum } from '../../../../schema/certificateList.schema'
import { CertificateCardHeading } from './CertificateCardHeading'

it('Should render correctly', () => {
  const { baseElement } = render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<CertificateCardHeading title="Foo" id="123" statuses={[CertificateStatusEnum.enum.NEW]} />} />
      </Routes>
    </MemoryRouter>
  )
  expect(baseElement).toMatchSnapshot()
})
