import { Certificate, CertificateMetadata, CertificateStatus, ResourceLink, ResourceLinkType } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiMiddleware } from '../../../store/api/apiMiddleware'
import { hideSpinner, showSpinner, updateCertificate } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import CertificateSidePanel from './CertificateSidePanel'

let testStore: EnhancedStore

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const history = createMemoryHistory()

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <CertificateSidePanel />
      </Router>
    </Provider>
  )
}

describe('CertificateSidePanel', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, certificateMiddleware])
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('renders without crashing', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  describe('spinner', () => {
    it('shall not render if showSpinner is true', () => {
      testStore.dispatch(showSpinner('x'))
      renderComponent()
      expect(screen.queryByText('Om intyget')).not.toBeInTheDocument()
    })

    it('shall render if showSpinner is false', () => {
      testStore.dispatch(hideSpinner)
      renderComponent()
      expect(screen.getAllByText('Om intyget')[0]).toBeVisible()
    })
  })

  describe('resource links', () => {
    it('shall render FMB panel if FMB resource link exists', () => {
      const tabText = 'FMB'
      renderFmbTab(tabText)
      expect(screen.getByText(tabText)).toBeVisible()
    })

    it('shall not render FMB panel if FMB resource link is missing', () => {
      const tabText = 'FMB'
      renderComponent()
      expect(screen.queryByText(tabText)).not.toBeInTheDocument()
    })

    it('shall render Question panel if Question resource link exists', () => {
      const tabText = 'Questions'
      renderQuestionTab(tabText)
      expect(screen.getByText(tabText)).toBeVisible()
    })

    it('shall not render Question panel if Question resource link is missing', () => {
      const tabText = 'Questions'
      renderComponent()
      expect(screen.queryByText(tabText)).not.toBeInTheDocument()
    })

    it('shall render questions not available panel if questions not available resource link exists', () => {
      const tabText = 'Questions not available'
      renderQuestionNotAvailableTab(tabText)
      expect(screen.getByText(tabText)).toBeVisible()
    })

    it('shall not render questions not available panel if questions not available resource link is missing', () => {
      const tabText = 'Questions not available'
      renderComponent()
      expect(screen.queryByText(tabText)).not.toBeInTheDocument()
    })
  })

  describe('opening tabs', () => {
    it('shall show FMB content when clicking FMB tab', async () => {
      const tabText = 'FMB'
      const expectedContent = 'Ange minst en diagnos för att få FMB-stöd.'
      renderFmbTab(tabText)
      await waitFor(() => userEvent.click(screen.getByText(tabText)))
      expect(screen.getByText(expectedContent)).toBeVisible()
    })

    it('shall show Question content when clicking Question tab', async () => {
      const tabText = 'Question'
      const expectedComplementText = 'Kompletteringsbegäran'
      const expectedAdministrativeText = 'Administrativa frågor'
      renderQuestionTab(tabText)
      await waitFor(() => userEvent.click(screen.getByText(tabText)))
      expect(screen.getByText(expectedComplementText)).toBeVisible()
      expect(screen.getByText(expectedAdministrativeText)).toBeVisible()
    })

    it('shall show Question not available content when clicking Question not available tab', async () => {
      const tabText = 'Question not available'
      const expectedContent = 'Intyget är inte skickat till Försäkringskassan.'
      renderQuestionNotAvailableTab(tabText)
      await waitFor(() => userEvent.click(screen.getByText(tabText)))
      expect(screen.getByText(expectedContent)).toBeVisible()
    })
  })
})

//Each one of these opens the about tab to have a default starting point for the tests opening other tabs
const renderFmbTab = (tabText: string) => {
  const resourceLinks: ResourceLink[] = [{ type: ResourceLinkType.FMB, name: tabText } as ResourceLink]
  const certificate = createCertificate(resourceLinks)
  testStore.dispatch(updateCertificate(certificate))
  renderComponent()
  openAboutTab()
}

const renderQuestionTab = (tabText: string) => {
  const resourceLinks: ResourceLink[] = [{ type: ResourceLinkType.QUESTIONS, name: tabText } as ResourceLink]
  const certificate = createCertificate(resourceLinks)
  testStore.dispatch(updateCertificate(certificate))
  renderComponent()
  openAboutTab()
}

const renderQuestionNotAvailableTab = (tabText: string) => {
  const resourceLinks: ResourceLink[] = [{ type: ResourceLinkType.QUESTIONS_NOT_AVAILABLE, name: tabText } as ResourceLink]
  const certificate = createCertificate(resourceLinks)
  testStore.dispatch(updateCertificate(certificate))
  renderComponent()
  openAboutTab()
}

const openAboutTab = () => {
  userEvent.click(screen.getAllByText('Om intyget')[0])
}

const createCertificate = (resourceLinks: ResourceLink[]): Certificate => {
  return {
    links: resourceLinks,
    metadata: { status: CertificateStatus.SIGNED } as CertificateMetadata,
  } as Certificate
}
