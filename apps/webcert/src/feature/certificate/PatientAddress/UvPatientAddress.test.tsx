import { fakeCertificate, fakeCertificateMetaData, fakePatient } from '@frontend/common'
import { act, screen } from '@testing-library/react'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { renderWithStore } from '../../../utils/renderWithStore'
import UvPatientAddress from './UvPatientAddress'

it('displays patient address info', (): void => {
  const { store } = renderWithStore(<UvPatientAddress />)
  act(() =>
    store.dispatch(
      updateCertificate(
        fakeCertificate({
          metadata: fakeCertificateMetaData({
            patient: fakePatient({
              street: 'test street 123',
              city: 'Test city',
              zipCode: 'zipcode',
            }),
          }),
        })
      )
    )
  )

  expect(screen.getByText(/test street 123/i)).toBeInTheDocument()
  expect(screen.getByText(/Test city/i)).toBeInTheDocument()
  expect(screen.getByText(/zipcode/i)).toBeInTheDocument()
})
