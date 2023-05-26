import { CertificateEventType, CertificateStatus, fakeCertificate, fakeCertificateMetaData, fakeStaff, fakeUnit } from '@frontend/common'
import { screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { updateCertificate, updateCertificateEvents } from '../../../store/certificate/certificateActions'
import { renderWithStore } from '../../../utils/renderWithStore'
import UvCareUnitAddress from './UvCareUnitAddress'

it('Should displays all care unit info', () => {
  const { store } = renderWithStore(<UvCareUnitAddress />)
  act(() => {
    store.dispatch(
      updateCertificate(
        fakeCertificate({
          metadata: fakeCertificateMetaData({
            issuedBy: fakeStaff({
              fullName: 'Test Testsson',
            }),
            unit: fakeUnit({
              address: 'test street 123',
              city: 'Test city',
              phoneNumber: 'phone',
              zipCode: 'zipcode',
            }),
          }),
        })
      )
    )
    store.dispatch(
      updateCertificateEvents([
        {
          certificateId: '1',
          relatedCertificateId: '1',
          relatedCertificateStatus: CertificateStatus.SIGNED,
          timestamp: '2023-02-20',
          type: CertificateEventType.CREATED,
        },
        {
          certificateId: '1',
          relatedCertificateId: '1',
          relatedCertificateStatus: CertificateStatus.SIGNED,
          timestamp: '2023-02-21',
          type: CertificateEventType.SIGNED,
        },
        {
          certificateId: '1',
          relatedCertificateId: '1',
          relatedCertificateStatus: CertificateStatus.SIGNED,
          timestamp: '2023-02-22',
          type: CertificateEventType.REVOKED,
        },
      ])
    )
  })

  expect(screen.getByRole('heading', { name: /ovanstående uppgifter och bedömningar bekräftas/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /namn och kontaktuppgifter till vårdenheten/i })).toBeInTheDocument()
  expect(screen.getByText(/Test Testsson/i)).toBeInTheDocument()
  expect(screen.getByText(/test street 123/i)).toBeInTheDocument()
  expect(screen.getByText(/Test city/i)).toBeInTheDocument()
  expect(screen.getByText(/phone/i)).toBeInTheDocument()
  expect(screen.getByText(/zipcode/i)).toBeInTheDocument()
  expect(screen.getByText(/2023-02-21/)).toBeInTheDocument()
})
