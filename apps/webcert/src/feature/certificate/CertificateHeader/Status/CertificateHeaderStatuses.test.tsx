import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { fakeCertificateMetaData, fakeCertificateRelation, fakeCertificateRelations } from '../../../../faker'
import store from '../../../../store/store'
import type { Question } from '../../../../types'
import { CertificateRelationType, CertificateStatus, QuestionType } from '../../../../types'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'

const SENT_TEXT = 'Intyget är skickat till Försäkringskassan'
const AVAILABLE_TEXT = 'Intyget är tillgängligt för patienten'
const DRAFT_SAVED = 'Utkastet är sparat'
const DRAFT_BEING_SAVED = 'Utkastet sparas'
const LOCKED_DRAFT_TEXT = 'Utkastet är låst'
const DRAFT_DATA_MISSING = 'Obligatoriska uppgifter saknas'
const DRAFT_ALL_DATA_EXISTS = 'Klart att signera'
const REVOKED_TEXT = 'Intyget är makulerat'
const REVOKED_DRAFT = 'Utkastet är makulerat'
const FK_ASKED_COMPLEMENT_TEXT = 'Försäkringskassan har begärt komplettering'
const COMPLEMENT_DRAFT = 'Det finns redan en påbörjad komplettering.'
const COMPLEMENT_CERTIFICATE = 'Intyget har kompletterats med ett annat intyg.'
const REVOKED_RENEWED = 'Intyget är förnyat utifrån ett tidigare intyg som också kan behöva makuleras.'
const REVOKED_REPLACED = 'Intyget ersatte ett tidigare intyg som också kan behöva makuleras.'
const REVOKED_COMPLEMENTED = 'Intyget är en komplettering av ett tidigare intyg som också kan behöva makuleras.'
const SIGNED_STATUS = 'Intyget är signerat'
const REPLACED_DRAFT = 'Det finns redan ett påbörjat utkast som ska ersätta detta intyg.'
const REPLACED_CERTIFICATE = 'Intyget har ersatts av'

const SIGNED_STATUSES = [
  AVAILABLE_TEXT,
  SENT_TEXT,
  REVOKED_TEXT,
  REVOKED_RENEWED,
  REVOKED_REPLACED,
  REVOKED_COMPLEMENTED,
  FK_ASKED_COMPLEMENT_TEXT,
  SIGNED_STATUS,
  COMPLEMENT_DRAFT,
  COMPLEMENT_CERTIFICATE,
  REPLACED_DRAFT,
  REPLACED_CERTIFICATE,
]

const SIGNED_STATUSES_WITHOUT_COMPLEMENT = [
  SENT_TEXT,
  REVOKED_TEXT,
  REVOKED_RENEWED,
  REVOKED_REPLACED,
  REVOKED_COMPLEMENTED,
  SIGNED_STATUS,
  REPLACED_DRAFT,
  REPLACED_CERTIFICATE,
]

const SIGNED_STATUSES_WITHOUT_REVOKED = [
  AVAILABLE_TEXT,
  SENT_TEXT,
  FK_ASKED_COMPLEMENT_TEXT,
  COMPLEMENT_DRAFT,
  COMPLEMENT_CERTIFICATE,
  SIGNED_STATUS,
  REPLACED_DRAFT,
  REPLACED_CERTIFICATE,
]

const SIGNED_STATUSES_WITHOUT_REPLACED = [
  SENT_TEXT,
  REVOKED_TEXT,
  REVOKED_RENEWED,
  REVOKED_REPLACED,
  REVOKED_COMPLEMENTED,
  FK_ASKED_COMPLEMENT_TEXT,
  SIGNED_STATUS,
  COMPLEMENT_DRAFT,
  COMPLEMENT_CERTIFICATE,
]

const DRAFT_STATUSES = [DRAFT_BEING_SAVED, DRAFT_SAVED, DRAFT_ALL_DATA_EXISTS, DRAFT_DATA_MISSING]

const renderComponent = (status: CertificateStatus, isSent: boolean, hasUndhandledComplementQuestions: boolean, isValidating: boolean) => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CertificateHeaderStatuses
          certificateMetadata={fakeCertificateMetaData({ status, sent: isSent, sentTo: isSent ? 'Försäkringskassan' : undefined })}
          questions={
            hasUndhandledComplementQuestions
              ? ([{ type: QuestionType.COMPLEMENT, handled: false }] as Question[])
              : ([{ type: QuestionType.COMPLEMENT, handled: true }] as Question[])
          }
          isValidating={isValidating}
        />
      </BrowserRouter>
    </Provider>
  )
}

const renderComponentWithDraft = (status: CertificateStatus, isValidating: boolean, isValidForSigning: boolean) => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CertificateHeaderStatuses
          certificateMetadata={fakeCertificateMetaData({ status, sent: false })}
          questions={[]}
          isValidating={isValidating}
          isValidForSigning={isValidForSigning}
        />
      </BrowserRouter>
    </Provider>
  )
}

const renderComponentWithParentRelation = (
  status: CertificateStatus,
  parentStatus: CertificateStatus,
  relationType: CertificateRelationType,
  isSent: boolean
) => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CertificateHeaderStatuses
          certificateMetadata={fakeCertificateMetaData({
            status,
            relations: fakeCertificateRelations({ parent: fakeCertificateRelation({ status: parentStatus, type: relationType }) }),
            sent: isSent,
          })}
          questions={[]}
          isValidating={false}
        />
      </BrowserRouter>
    </Provider>
  )
}

const renderComponentWithChildRelation = (
  status: CertificateStatus,
  childStatus: CertificateStatus,
  relationType: CertificateRelationType,
  isSent: boolean,
  hasUnhandledComplementQuestions: boolean
) => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CertificateHeaderStatuses
          certificateMetadata={fakeCertificateMetaData({
            status,
            relations: {
              parent: null,
              children: [
                fakeCertificateRelation({
                  type: relationType,
                  status: childStatus,
                }),
              ],
            },
            sent: isSent,
            sentTo: isSent ? 'Försäkringskassan' : undefined,
          })}
          isValidating={false}
          questions={
            hasUnhandledComplementQuestions
              ? ([{ type: QuestionType.COMPLEMENT, handled: false }] as Question[])
              : ([{ type: QuestionType.COMPLEMENT, handled: true }] as Question[])
          }
        />
      </BrowserRouter>
    </Provider>
  )
}

describe('Certificate header statuses', () => {
  describe('Signed certificate statuses', () => {
    it('should display status that certificate is signed and avaialble for patient', () => {
      renderComponent(CertificateStatus.SIGNED, false, false, false)
      expect(screen.getByText(SIGNED_STATUS, { exact: false })).toBeInTheDocument()
      expect(screen.getByText(AVAILABLE_TEXT, { exact: false })).toBeInTheDocument()
    })

    it('should display status that certificate is sent and available for patient', () => {
      renderComponent(CertificateStatus.SIGNED, true, false, false)
      expect(screen.queryByText(SIGNED_STATUS, { exact: false })).not.toBeInTheDocument()
      expect(screen.getByText(AVAILABLE_TEXT, { exact: false })).toBeInTheDocument()
      expect(screen.getByText(SENT_TEXT, { exact: false })).toBeInTheDocument()
    })
  })
  describe('Draft statuses', () => {
    it('should display status that draft is saved and data is missing', () => {
      renderComponentWithDraft(CertificateStatus.UNSIGNED, false, false)
      expect(screen.getByText(DRAFT_SAVED, { exact: false })).toBeInTheDocument()
      expect(screen.getByText(DRAFT_DATA_MISSING, { exact: false })).toBeInTheDocument()
    })

    it('should display status that draft is being saved and data is missing', () => {
      renderComponentWithDraft(CertificateStatus.UNSIGNED, true, false)
      expect(screen.getByText(DRAFT_BEING_SAVED, { exact: false })).toBeInTheDocument()
      expect(screen.getByText(DRAFT_DATA_MISSING, { exact: false })).toBeInTheDocument()
    })

    it('should display status that draft is saved and data is not missing', () => {
      renderComponentWithDraft(CertificateStatus.UNSIGNED, false, true)
      expect(screen.getByText(DRAFT_SAVED, { exact: false })).toBeInTheDocument()
      expect(screen.getByText(DRAFT_ALL_DATA_EXISTS, { exact: false })).toBeInTheDocument()
    })

    it('should not display stauses for signed certificate when certificate is a draft', () => {
      renderComponentWithDraft(CertificateStatus.UNSIGNED, false, false)
      SIGNED_STATUSES.forEach((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should display status that draft is locked', () => {
      renderComponentWithDraft(CertificateStatus.LOCKED, false, false)
      expect(screen.getByText(LOCKED_DRAFT_TEXT, { exact: false })).toBeInTheDocument()
    })

    it('should display status that draft is locked revoked', () => {
      renderComponentWithDraft(CertificateStatus.LOCKED_REVOKED, false, false)
      expect(screen.getByText(REVOKED_DRAFT, { exact: false })).toBeInTheDocument()
    })

    it('should not display stauses for signed certificate when certificate is a locked draft', () => {
      renderComponentWithDraft(CertificateStatus.LOCKED, false, false)
      SIGNED_STATUSES.forEach((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should not display stauses for signed certificate when certificate is a locked revoked draft', () => {
      renderComponentWithDraft(CertificateStatus.LOCKED_REVOKED, false, false)
      SIGNED_STATUSES.forEach((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should not display stauses for saving draft when certificate is locked and validating', () => {
      renderComponentWithDraft(CertificateStatus.LOCKED, true, false)
      DRAFT_STATUSES.forEach((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should not display staus for saving draft when certificate is locked revoked and validating', () => {
      renderComponentWithDraft(CertificateStatus.LOCKED_REVOKED, true, false)
      DRAFT_STATUSES.forEach((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should not display stauses for saving draft when certificate is locked', () => {
      renderComponentWithDraft(CertificateStatus.LOCKED, false, true)
      DRAFT_STATUSES.forEach((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should not display staus for saving draft when certificate is locked revoked', () => {
      renderComponentWithDraft(CertificateStatus.LOCKED_REVOKED, false, true)
      DRAFT_STATUSES.forEach((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })
  })

  describe('Revoked certificate statuses', () => {
    it('should display revoked message when revoked', () => {
      renderComponent(CertificateStatus.REVOKED, false, false, false)
      expect(screen.getByText(REVOKED_TEXT)).toBeInTheDocument()
    })

    it('should not display draft messages when revoked', () => {
      renderComponent(CertificateStatus.REVOKED, false, false, false)
      DRAFT_STATUSES.forEach((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should display revoked message and link message when renewed certificate is revoked', () => {
      renderComponentWithParentRelation(CertificateStatus.REVOKED, CertificateStatus.SIGNED, CertificateRelationType.EXTENDED, false)
      expect(screen.getByText(REVOKED_TEXT)).toBeInTheDocument()
      expect(screen.getByText(REVOKED_RENEWED)).toBeInTheDocument()
    })

    it('should not display signed messages when renewed certificate is revoked', () => {
      renderComponentWithParentRelation(CertificateStatus.REVOKED, CertificateStatus.SIGNED, CertificateRelationType.EXTENDED, false)
      SIGNED_STATUSES_WITHOUT_REVOKED.forEach((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should display revoked message and link message when replaced certificate is revoked', () => {
      renderComponentWithParentRelation(CertificateStatus.REVOKED, CertificateStatus.SIGNED, CertificateRelationType.REPLACED, false)
      expect(screen.getByText(REVOKED_TEXT)).toBeInTheDocument()
      expect(screen.getByText(REVOKED_REPLACED)).toBeInTheDocument()
    })

    it('should not display signed messages when replaced certificate is revoked', () => {
      renderComponentWithParentRelation(CertificateStatus.REVOKED, CertificateStatus.SIGNED, CertificateRelationType.REPLACED, false)
      SIGNED_STATUSES_WITHOUT_REVOKED.forEach((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should display revoked message and link message when complemented certificate is revoked', () => {
      renderComponentWithParentRelation(CertificateStatus.REVOKED, CertificateStatus.SIGNED, CertificateRelationType.COMPLEMENTED, false)
      expect(screen.getByText(REVOKED_TEXT)).toBeInTheDocument()
      expect(screen.getByText(REVOKED_COMPLEMENTED)).toBeInTheDocument()
    })

    it('should not display signed messages when complemented certificate is revoked', () => {
      renderComponentWithParentRelation(CertificateStatus.REVOKED, CertificateStatus.SIGNED, CertificateRelationType.COMPLEMENTED, false)
      SIGNED_STATUSES_WITHOUT_REVOKED.forEach((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should not display sent status  when certificate is revoked', () => {
      renderComponent(CertificateStatus.REVOKED, true, false, false)
      expect(screen.queryByText(SENT_TEXT)).not.toBeInTheDocument()
    })

    it('should not display available for patient when certificate is revoked', () => {
      renderComponent(CertificateStatus.REVOKED, false, false, false)
      expect(screen.queryByText(AVAILABLE_TEXT)).not.toBeInTheDocument()
    })

    it('should not display signed status when certificate is revoked', () => {
      renderComponent(CertificateStatus.REVOKED, false, false, false)
      expect(screen.queryByText(SIGNED_STATUS)).not.toBeInTheDocument()
    })
  })

  describe('Complemented certificate', () => {
    it('should display status certificate has unhandled complements together with certificate is avaialable for patient', () => {
      renderComponent(CertificateStatus.SIGNED, true, true, false)
      expect(screen.getByText(FK_ASKED_COMPLEMENT_TEXT)).toBeInTheDocument()
      expect(screen.getByText(AVAILABLE_TEXT)).toBeInTheDocument()
    })

    it('should not display draft statuses when certificate has unhandled complements', () => {
      renderComponent(CertificateStatus.SIGNED, true, true, false)
      DRAFT_STATUSES.forEach((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should display status that a complement draft exists together with certificate is available for patient', () => {
      renderComponentWithChildRelation(
        CertificateStatus.SIGNED,
        CertificateStatus.UNSIGNED,
        CertificateRelationType.COMPLEMENTED,
        true,
        true
      )
      expect(screen.queryByText(FK_ASKED_COMPLEMENT_TEXT)).not.toBeInTheDocument()
      expect(screen.getByText(COMPLEMENT_DRAFT)).toBeInTheDocument()
      expect(screen.getByText(AVAILABLE_TEXT)).toBeInTheDocument()
    })

    it('should not display draft statuses when certificate has been complemented', () => {
      renderComponentWithChildRelation(
        CertificateStatus.SIGNED,
        CertificateStatus.UNSIGNED,
        CertificateRelationType.COMPLEMENTED,
        true,
        true
      )
      DRAFT_STATUSES.forEach((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should not display signed certificate statuses when certificate has been complemented', () => {
      renderComponentWithChildRelation(
        CertificateStatus.SIGNED,
        CertificateStatus.UNSIGNED,
        CertificateRelationType.COMPLEMENTED,
        true,
        true
      )
      SIGNED_STATUSES_WITHOUT_COMPLEMENT.forEach((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should display status that a complementing certificate exists together with certificate is available for patient', () => {
      renderComponentWithChildRelation(CertificateStatus.SIGNED, CertificateStatus.SIGNED, CertificateRelationType.COMPLEMENTED, true, true)
      expect(screen.queryByText(FK_ASKED_COMPLEMENT_TEXT)).not.toBeInTheDocument()
      expect(screen.getByText(COMPLEMENT_CERTIFICATE)).toBeInTheDocument()
      expect(screen.getByText(AVAILABLE_TEXT)).toBeInTheDocument()
    })

    it('should not display status that a complementing certificate exists if it has been revoked', () => {
      renderComponentWithChildRelation(
        CertificateStatus.SIGNED,
        CertificateStatus.REVOKED,
        CertificateRelationType.COMPLEMENTED,
        true,
        true
      )
      expect(screen.getByText(FK_ASKED_COMPLEMENT_TEXT)).toBeInTheDocument()
      expect(screen.queryByText(COMPLEMENT_CERTIFICATE)).not.toBeInTheDocument()
      expect(screen.queryByText(COMPLEMENT_DRAFT)).not.toBeInTheDocument()
      expect(screen.getByText(AVAILABLE_TEXT)).toBeInTheDocument()
    })
  })

  describe('Replaced certificate', () => {
    it('should display status that a replacing draft exists together with certificate is available for patient', () => {
      renderComponentWithChildRelation(CertificateStatus.SIGNED, CertificateStatus.UNSIGNED, CertificateRelationType.REPLACED, false, false)
      expect(screen.getByText(REPLACED_DRAFT)).toBeInTheDocument()
      expect(screen.queryByText(REPLACED_CERTIFICATE)).not.toBeInTheDocument()
      expect(screen.getByText(AVAILABLE_TEXT)).toBeInTheDocument()
    })

    it('should display status that a replacing certificate exists exists together with certificate is available for patient', () => {
      renderComponentWithChildRelation(CertificateStatus.SIGNED, CertificateStatus.SIGNED, CertificateRelationType.REPLACED, false, false)
      expect(screen.getByText(REPLACED_CERTIFICATE)).toBeInTheDocument()
      expect(screen.queryByText(REPLACED_DRAFT)).not.toBeInTheDocument()
      expect(screen.getByText(AVAILABLE_TEXT)).toBeInTheDocument()
    })

    it('should not display draft statuses when certificate has been replaced', () => {
      renderComponentWithChildRelation(CertificateStatus.SIGNED, CertificateStatus.UNSIGNED, CertificateRelationType.REPLACED, true, true)
      DRAFT_STATUSES.forEach((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should not display draft statuses when certificate has been replaced and signed', () => {
      renderComponentWithChildRelation(CertificateStatus.SIGNED, CertificateStatus.UNSIGNED, CertificateRelationType.REPLACED, true, true)
      SIGNED_STATUSES_WITHOUT_REPLACED.forEach((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should display status certificate is sent and available if replacing certificate is revoked', () => {
      renderComponentWithChildRelation(CertificateStatus.SIGNED, CertificateStatus.REVOKED, CertificateRelationType.REPLACED, true, false)
      expect(screen.queryByText(REPLACED_CERTIFICATE)).not.toBeInTheDocument()
      expect(screen.queryByText(REPLACED_DRAFT)).not.toBeInTheDocument()
      expect(screen.getByText(AVAILABLE_TEXT)).toBeInTheDocument()
      expect(screen.getByText(SENT_TEXT)).toBeInTheDocument()
    })

    it('should display status certificate is signed and available if replacing certificate is revoked', () => {
      renderComponentWithChildRelation(CertificateStatus.SIGNED, CertificateStatus.REVOKED, CertificateRelationType.REPLACED, false, false)
      expect(screen.queryByText(REPLACED_CERTIFICATE)).not.toBeInTheDocument()
      expect(screen.queryByText(REPLACED_DRAFT)).not.toBeInTheDocument()
      expect(screen.getByText(AVAILABLE_TEXT)).toBeInTheDocument()
      expect(screen.getByText(SIGNED_STATUS)).toBeInTheDocument()
    })
  })
})
