import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { CertificateRelationType, CertificateStatus } from '../../../../../../common/src/types/certificate'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import { BrowserRouter } from 'react-router-dom'
import CertificateHeaderStatuses from './CertificateHeaderStatuses'
import {
  createCertificateMetadataWithParentRelation,
  createCertificateMetadataWithReplacedOption,
  createHistoryEntriesWithComplementEvent,
} from './statusTestUtils'
import { QuestionType } from '@frontend/common/src'

const SENT_TEXT = 'Intyget är skickat till Försäkringskassan'
const AVAILABLE_TEXT = 'Intyget är tillgängligt för patienten'
const DRAFT_TEXT = 'Utkastet är sparat'
const DRAFT_BEING_SAVED = 'Utkastet sparas'
const LOCKED_DRAFT_TEXT = 'Utkastet är låst'
const REVOKED_TEXT = 'Intyget är makulerat'
const REVOKED_DRAFT = 'Utkastet är makulerat'
const FK_ASKED_COMPLEMENT_TEXT = 'Försäkringskassan har begärt komplettering'
const REVOKED_RENEWED = 'Intyget är förnyat utifrån ett tidigare intyg som också kan behöva makuleras.'
const REVOKED_REPLACED = 'Intyget ersatte ett tidigare intyg som också kan behöva makuleras.'
const REVOKED_COMPLEMENTED = 'Intyget är en komplettering av ett tidigare intyg som också kan behöva makuleras.'
const SIGNED_STATUS = 'Intyget är signerat'

const SIGNED_STATUSES = [
  AVAILABLE_TEXT,
  SENT_TEXT,
  REVOKED_TEXT,
  REVOKED_RENEWED,
  REVOKED_REPLACED,
  REVOKED_COMPLEMENTED,
  FK_ASKED_COMPLEMENT_TEXT,
  SIGNED_STATUS,
]
const SIGNED_STATUSES_WITHOUT_REVOKED = [AVAILABLE_TEXT, SENT_TEXT, FK_ASKED_COMPLEMENT_TEXT, SIGNED_STATUS]
const DRAFT_STAUSES = [DRAFT_BEING_SAVED, DRAFT_TEXT]

const renderComponent = (
  status: CertificateStatus,
  isSent: boolean,
  isReplaced: boolean,
  childStatus: CertificateStatus | undefined,
  hasUndhandledComplementQuestions: boolean,
  isComplemented: boolean,
  isValidating: boolean,
  isRenewed: boolean,
  complementStatus?: CertificateStatus
) => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CertificateHeaderStatuses
          certificateMetadata={getMetadata(status, isSent, isReplaced, childStatus)}
          historyEntries={isComplemented && complementStatus ? createHistoryEntriesWithComplementEvent(complementStatus) : []}
          questions={
            hasUndhandledComplementQuestions
              ? [{ type: QuestionType.COMPLEMENT, handled: false }]
              : [{ type: QuestionType.COMPLEMENT, handled: true }]
          }
          isValidating={isValidating}
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
          certificateMetadata={createCertificateMetadataWithParentRelation(status, parentStatus, relationType, isSent)}
          historyEntries={[]}
          questions={[]}
          isValidating={false}
        />
      </BrowserRouter>
    </Provider>
  )
}

const getMetadata = (status: CertificateStatus, isSent: boolean, isReplaced: boolean, childStatus: CertificateStatus | undefined) => {
  return createCertificateMetadataWithReplacedOption(status, isReplaced, childStatus, isSent)
}

describe('Certificate header statuses', () => {
  describe('Draft statuses', () => {
    it('should display status that draft is saved', () => {
      renderComponent(CertificateStatus.UNSIGNED, false, false, undefined, false, false, false, false)
      expect(screen.getByText(DRAFT_TEXT, { exact: false })).toBeInTheDocument()
    })

    it('should display status that draft is being saved', () => {
      renderComponent(CertificateStatus.UNSIGNED, false, false, undefined, false, false, true, false)
      expect(screen.getByText(DRAFT_BEING_SAVED, { exact: false })).toBeInTheDocument()
    })

    it('should not display stauses for signed certificate when certificate is a draft', () => {
      renderComponent(CertificateStatus.UNSIGNED, false, false, undefined, false, false, false, false)
      SIGNED_STATUSES.map((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should display status that draft is locked', () => {
      renderComponent(CertificateStatus.LOCKED, false, false, undefined, false, false, false, false)
      expect(screen.getByText(LOCKED_DRAFT_TEXT, { exact: false })).toBeInTheDocument()
    })

    it('should display status that draft is locked revoked', () => {
      renderComponent(CertificateStatus.LOCKED_REVOKED, false, false, undefined, false, false, false, false)
      expect(screen.getByText(REVOKED_DRAFT, { exact: false })).toBeInTheDocument()
    })

    it('should not display stauses for signed certificate when certificate is a locked draft', () => {
      renderComponent(CertificateStatus.LOCKED, false, false, undefined, false, false, false, false)
      SIGNED_STATUSES.map((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should not display stauses for signed certificate when certificate is a locked revoked draft', () => {
      renderComponent(CertificateStatus.LOCKED_REVOKED, false, false, undefined, false, false, false, false)
      SIGNED_STATUSES.map((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should not display stauses for signed certificate when certificate is a locked revoked draft', () => {
      renderComponent(CertificateStatus.LOCKED_REVOKED, false, false, undefined, false, false, false, false)
      expect(screen.queryByText(REVOKED_DRAFT)).toBeInTheDocument()
    })

    it('should not display staus for saving draft when certificate is locked', () => {
      renderComponent(CertificateStatus.LOCKED, false, false, undefined, false, false, true, false)
      expect(screen.queryByText(DRAFT_BEING_SAVED)).not.toBeInTheDocument()
    })

    it('should not display staus for saving draft when certificate is locked revoked', () => {
      renderComponent(CertificateStatus.LOCKED_REVOKED, false, false, undefined, false, false, true, false)
      expect(screen.queryByText(DRAFT_BEING_SAVED)).not.toBeInTheDocument()
    })

    it('should not display staus for saved draft when certificate is locked', () => {
      renderComponent(CertificateStatus.LOCKED, false, false, undefined, false, false, false, false)
      expect(screen.queryByText(DRAFT_BEING_SAVED)).not.toBeInTheDocument()
    })

    it('should not display staus for saving draft when certificate is locked revoked', () => {
      renderComponent(CertificateStatus.LOCKED_REVOKED, false, false, undefined, false, false, false, false)
      expect(screen.queryByText(DRAFT_BEING_SAVED)).not.toBeInTheDocument()
    })
  })

  describe('Revoked certificate statuses', () => {
    it('should display revoked message when revoked', () => {
      renderComponent(CertificateStatus.REVOKED, false, false, undefined, false, false, false, false)
      expect(screen.queryByText(REVOKED_TEXT)).toBeInTheDocument()
    })

    it('should display revoked message and link message when renewed certificate is revoked', () => {
      renderComponentWithParentRelation(CertificateStatus.REVOKED, CertificateStatus.SIGNED, CertificateRelationType.EXTENDED, false)
      expect(screen.getByText(REVOKED_TEXT)).toBeInTheDocument()
      expect(screen.getByText(REVOKED_RENEWED)).toBeInTheDocument()
    })

    it('should not display signed messages when renewed certificate is revoked', () => {
      renderComponentWithParentRelation(CertificateStatus.REVOKED, CertificateStatus.SIGNED, CertificateRelationType.EXTENDED, false)
      SIGNED_STATUSES_WITHOUT_REVOKED.map((status) => {
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
      SIGNED_STATUSES_WITHOUT_REVOKED.map((status) => {
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
      SIGNED_STATUSES_WITHOUT_REVOKED.map((status) => {
        expect(screen.queryByText(status)).not.toBeInTheDocument()
      })
    })

    it('should not display sent status  when certificate is revoked', () => {
      renderComponent(CertificateStatus.REVOKED, true, false, undefined, false, false, false, false)
      expect(screen.queryByText(SENT_TEXT)).not.toBeInTheDocument()
    })

    it('should not display available for patient when certificate is revoked', () => {
      renderComponent(CertificateStatus.REVOKED, false, false, undefined, false, false, false, false)
      expect(screen.queryByText(AVAILABLE_TEXT)).not.toBeInTheDocument()
    })

    it('should not display signed status when certificate is revoked', () => {
      renderComponent(CertificateStatus.REVOKED, false, false, undefined, false, false, false, false)
      expect(screen.queryByText(SIGNED_STATUS)).not.toBeInTheDocument()
    })
  })
})
