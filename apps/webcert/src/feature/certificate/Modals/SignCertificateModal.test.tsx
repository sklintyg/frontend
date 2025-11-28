import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { fakeCertificate, fakeUser } from '../../../faker'
import { updateCertificate, updateCertificateSignStatus } from '../../../store/certificate/certificateActions'
import store from '../../../store/store'
import { updateUser } from '../../../store/user/userActions'
import { CertificateSignStatus, LoginMethod, SigningMethod } from '../../../types'
import { SignCertificateModal } from './SignCertificateModal'

function renderComponent() {
  return render(
    <Provider store={store}>
      <SignCertificateModal />
    </Provider>
  )
}

describe('SingCertificateModal', () => {
  describe('Initial state', () => {
    it('Modal should not be opened', () => {
      const { container } = renderComponent()
      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('Not initial state', () => {
    beforeEach(() => {
      store.dispatch(updateUser(fakeUser({ signingMethod: SigningMethod.BANK_ID, loginMethod: LoginMethod.BANK_ID })))
      store.dispatch(updateCertificate(fakeCertificate()))
      store.dispatch(updateCertificateSignStatus(CertificateSignStatus.PROCESSING))
    })

    it('Should display correct title', () => {
      renderComponent()
      expect(screen.getByText('Signera intyget med BankID')).toBeInTheDocument()
    })

    it('Should have cancel buttons', () => {
      renderComponent()
      expect(screen.getByText('Avbryt')).toBeInTheDocument()
    })
  })
})
