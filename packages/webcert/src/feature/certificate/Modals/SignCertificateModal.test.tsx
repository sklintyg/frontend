import { LoginMethod, SigningMethod } from '@frontend/common'
import { CertificateSignStatus } from '@frontend/common/src/types/certificate'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ErrorCode } from '../../../store/error/errorReducer'
import { SignCertificateModal } from './SignCertificateModal'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}))

const mockedUseSelector = useSelector as jest.Mock

type SigninError = { errorCode: ErrorCode; message: string }

const getTestState = (
  signingStatus: CertificateSignStatus = CertificateSignStatus.INITIAL,
  loginMethod: LoginMethod = LoginMethod.BANK_ID,
  signingError: SigninError | undefined = undefined
) => ({
  ui: {
    uiUser: {
      user: {
        signingMethod: SigningMethod.BANK_ID,
        loginMethod,
      },
    },
    uiCertificate: {
      signingStatus,
      signingError,
    },
    uiUtils: {
      dynamicLinks: {
        ineraKundserviceAnmalFel: {
          target: '_blank',
          url: 'inera/kundservice/anmal/fel',
          tooltip: 'ineraKundserviceAnmalFel',
          text: 'ineraKundserviceAnmalFel',
        },
      },
    },
  },
})

const getSigningError = (errorCode: ErrorCode = ErrorCode.PU_PROBLEM, message = ''): SigninError => ({
  errorCode,
  message,
})

afterEach(() => {
  mockedUseSelector.mockClear()
})

describe('SingCertificateModal', () => {
  describe('Initial state', () => {
    it('Modal should not be opened', () => {
      mockedUseSelector.mockImplementation((callback) => callback(getTestState()))
      const { container } = render(<SignCertificateModal />)
      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('Processing state', () => {
    beforeEach(() => {
      mockedUseSelector.mockImplementation((callback) => callback(getTestState(CertificateSignStatus.PROCESSING)))
    })

    it('Should display correct title', () => {
      render(<SignCertificateModal />)
      expect(screen.queryByText('Ditt intyg signeras')).toBeInTheDocument()
    })

    it('Should not have any buttons', () => {
      render(<SignCertificateModal />)
      expect(screen.getByTestId('modal-buttons')).toBeEmptyDOMElement()
    })

    it('Should display desktop text', () => {
      render(<SignCertificateModal />)
      expect(screen.queryByText(/Om ditt BankID säkerhetsprogram inte öppnas/i)).toBeInTheDocument()
      expect(screen.queryByText(/Starta mobilt BankID/i)).not.toBeInTheDocument()
    })

    it('Should display mobile text', () => {
      mockedUseSelector.mockImplementation((callback) =>
        callback(getTestState(CertificateSignStatus.PROCESSING, LoginMethod.BANK_ID_MOBILE))
      )
      render(<SignCertificateModal />)
      expect(screen.queryByText(/Starta mobilt BankID/i)).toBeInTheDocument()
      expect(screen.queryByText(/Om ditt BankID säkerhetsprogram inte öppnas/i)).not.toBeInTheDocument()
    })
  })

  describe('No client state', () => {
    beforeEach(() => {
      mockedUseSelector.mockImplementation((callback) => callback(getTestState(CertificateSignStatus.NO_CLIENT)))
    })

    it('Should display correct title', () => {
      render(<SignCertificateModal />)
      expect(screen.queryByText('Ditt intyg signeras')).toBeInTheDocument()
    })

    it('Should not have any buttons', () => {
      render(<SignCertificateModal />)
      expect(screen.getByTestId('modal-buttons')).toBeEmptyDOMElement()
    })

    it('Should display desktop text', () => {
      render(<SignCertificateModal />)
      expect(screen.queryByText(/BankID-servern får ej kontakt med ditt BankID säkerhetsprogram/i)).toBeInTheDocument()
      expect(screen.queryByText(/Mobilt BankID-servern får ej kontakt/i)).not.toBeInTheDocument()
    })

    it('Should display mobile text', () => {
      mockedUseSelector.mockImplementation((callback) =>
        callback(getTestState(CertificateSignStatus.NO_CLIENT, LoginMethod.BANK_ID_MOBILE))
      )
      render(<SignCertificateModal />)
      expect(screen.queryByText(/Mobilt BankID-servern får ej kontakt/i)).toBeInTheDocument()
      expect(screen.queryByText(/BankID-servern får ej kontakt med ditt BankID säkerhetsprogram/i)).not.toBeInTheDocument()
    })
  })

  describe('Failed state', () => {
    beforeEach(() => {
      mockedUseSelector.mockImplementation((callback) => callback(getTestState(CertificateSignStatus.FAILED)))
    })

    it('Should display correct title', () => {
      render(<SignCertificateModal />)
      expect(screen.queryByText('Signering misslyckad')).toBeInTheDocument()
    })

    it('Should have a close buttons', () => {
      render(<SignCertificateModal />)
      expect(screen.getByTestId('modal-buttons')).not.toBeEmptyDOMElement()
      expect(screen.queryByText('Stäng')).toBeInTheDocument()
    })

    it('Should display text for ErrorCode.PU_PROBLEM', () => {
      mockedUseSelector.mockImplementation((callback) =>
        callback(getTestState(CertificateSignStatus.FAILED, LoginMethod.BANK_ID, getSigningError(ErrorCode.PU_PROBLEM)))
      )
      render(
        <BrowserRouter>
          <SignCertificateModal />
        </BrowserRouter>
      )
      expect(screen.queryByText(/Personuppgiftstjänsten svarar inte/i)).toBeInTheDocument()
    })

    it('Should display text for ErrorCode.DATA_NOT_FOUND', () => {
      mockedUseSelector.mockImplementation((callback) =>
        callback(getTestState(CertificateSignStatus.FAILED, LoginMethod.BANK_ID, getSigningError(ErrorCode.DATA_NOT_FOUND)))
      )
      render(
        <BrowserRouter>
          <SignCertificateModal />
        </BrowserRouter>
      )
      expect(screen.queryByText(/Intyget finns inte/i)).toBeInTheDocument()
    })

    it('Should display text for ErrorCode.INVALID_STATE', () => {
      mockedUseSelector.mockImplementation((callback) =>
        callback(getTestState(CertificateSignStatus.FAILED, LoginMethod.BANK_ID, getSigningError(ErrorCode.INVALID_STATE)))
      )
      render(
        <BrowserRouter>
          <SignCertificateModal />
        </BrowserRouter>
      )
      expect(screen.queryByText(/Signeringen kunde inte slutföras/i)).toBeInTheDocument()
    })

    it('Should display text for ErrorCode.SIGN_NETID_ERROR', () => {
      mockedUseSelector.mockImplementation((callback) =>
        callback(getTestState(CertificateSignStatus.FAILED, LoginMethod.BANK_ID, getSigningError(ErrorCode.SIGN_NETID_ERROR)))
      )
      render(
        <BrowserRouter>
          <SignCertificateModal />
        </BrowserRouter>
      )
      expect(screen.queryByText(/Detta beror antingen på ett tekniskt fel/i)).toBeInTheDocument()
    })

    it('Should display text for ErrorCode.CONCURRENT_MODIFICATION', () => {
      mockedUseSelector.mockImplementation((callback) =>
        callback(getTestState(CertificateSignStatus.FAILED, LoginMethod.BANK_ID, getSigningError(ErrorCode.CONCURRENT_MODIFICATION)))
      )
      render(
        <BrowserRouter>
          <SignCertificateModal />
        </BrowserRouter>
      )
      expect(screen.queryByText(/Utkastet har ändrats av en annan användare/i)).toBeInTheDocument()
    })

    it('Should display text for ErrorCode.AUTHORIZATION_PROBLEM', () => {
      mockedUseSelector.mockImplementation((callback) =>
        callback(getTestState(CertificateSignStatus.FAILED, LoginMethod.BANK_ID, getSigningError(ErrorCode.AUTHORIZATION_PROBLEM)))
      )
      render(
        <BrowserRouter>
          <SignCertificateModal />
        </BrowserRouter>
      )
      expect(screen.queryByText(/Du saknar behörighet att signera detta intyg/i)).toBeInTheDocument()
    })

    it('Should display text for ErrorCode.INDETERMINATE_IDENTITY', () => {
      mockedUseSelector.mockImplementation((callback) =>
        callback(getTestState(CertificateSignStatus.FAILED, LoginMethod.BANK_ID, getSigningError(ErrorCode.INDETERMINATE_IDENTITY)))
      )
      render(
        <BrowserRouter>
          <SignCertificateModal />
        </BrowserRouter>
      )
      expect(screen.queryByText(/valt en annan identitet att signera med än den du loggade in med/i)).toBeInTheDocument()
    })
  })
})
