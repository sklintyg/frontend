import { CertificateSignStatus, LoginMethod, SigningMethod } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import { useSelector } from 'react-redux'
import { Mock, vi } from 'vitest'
import { ErrorCode } from '../../../store/error/errorReducer'
import { SignCertificateModal } from './SignCertificateModal'

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}))

const mockedUseSelector = useSelector as Mock

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
      expect(screen.getByText('Ditt intyg signeras')).toBeInTheDocument()
    })

    it('Should not have any buttons', () => {
      render(<SignCertificateModal />)
      expect(screen.getByTestId('modal-buttons')).toBeEmptyDOMElement()
    })

    it('Should display desktop text', () => {
      render(<SignCertificateModal />)
      expect(screen.getByText(/Om ditt BankID säkerhetsprogram inte öppnas/i)).toBeInTheDocument()
      expect(screen.queryByText(/Starta mobilt BankID/i)).not.toBeInTheDocument()
    })

    it('Should display mobile text', () => {
      mockedUseSelector.mockImplementation((callback) =>
        callback(getTestState(CertificateSignStatus.PROCESSING, LoginMethod.BANK_ID_MOBILE))
      )
      render(<SignCertificateModal />)
      expect(screen.getByText(/Starta mobilt BankID/i)).toBeInTheDocument()
      expect(screen.queryByText(/Om ditt BankID säkerhetsprogram inte öppnas/i)).not.toBeInTheDocument()
    })
  })

  describe('No client state', () => {
    beforeEach(() => {
      mockedUseSelector.mockImplementation((callback) => callback(getTestState(CertificateSignStatus.NO_CLIENT)))
    })

    it('Should display correct title', () => {
      render(<SignCertificateModal />)
      expect(screen.getByText('Ditt intyg signeras')).toBeInTheDocument()
    })

    it('Should not have any buttons', () => {
      render(<SignCertificateModal />)
      expect(screen.getByTestId('modal-buttons')).toBeEmptyDOMElement()
    })

    it('Should display desktop text', () => {
      render(<SignCertificateModal />)
      expect(screen.getByText(/BankID-servern får ej kontakt med ditt BankID säkerhetsprogram/i)).toBeInTheDocument()
      expect(screen.queryByText(/Mobilt BankID-servern får ej kontakt/i)).not.toBeInTheDocument()
    })

    it('Should display mobile text', () => {
      mockedUseSelector.mockImplementation((callback) =>
        callback(getTestState(CertificateSignStatus.NO_CLIENT, LoginMethod.BANK_ID_MOBILE))
      )
      render(<SignCertificateModal />)
      expect(screen.getByText(/Mobilt BankID-servern får ej kontakt/i)).toBeInTheDocument()
      expect(screen.queryByText(/BankID-servern får ej kontakt med ditt BankID säkerhetsprogram/i)).not.toBeInTheDocument()
    })
  })
})
