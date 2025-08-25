import { render, screen } from '@testing-library/react'
import { useSelector } from 'react-redux'
import type { Mock } from 'vitest'
import { vi } from 'vitest'
import type { ErrorCode } from '../../../store/error/errorReducer'
import { SignCertificateModal } from './SignCertificateModal'
import { CertificateSignStatus, LoginMethod, SigningMethod } from '../../../types'

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

  describe('Not initial state', () => {
    beforeEach(() => {
      mockedUseSelector.mockImplementation((callback) => callback(getTestState(CertificateSignStatus.PROCESSING)))
    })

    it('Should display correct title', () => {
      render(<SignCertificateModal />)
      expect(screen.getByText('Signera intyget med BankID')).toBeInTheDocument()
    })

    it('Should have cancel buttons', () => {
      render(<SignCertificateModal />)
      expect(screen.getByText('Avbryt')).toBeInTheDocument()
    })
  })
})
