import { fakeCertificate, fakeCertificateMetaData } from '@frontend/common'
import { screen } from '@testing-library/react'
import faker from 'faker'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

import { act } from 'react-dom/test-utils'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { renderWithStore } from '../../../utils/renderWithStore'
import AboutCertificatePanel from './AboutCertificatePanel'

const history = createMemoryHistory()

const text1 = faker.lorem.sentence(10)
const text2 = faker.lorem.sentence(10)
const text3 = faker.lorem.sentence(10)
const link1 = faker.lorem.word()
const link2 = faker.lorem.word()

const descriptionWithLinks = `${text1} <LINK:${link1}> ${text2} <LINK:${link2}> ${text3}`
const renderComponent = () => {
  const { store } = renderWithStore(
    <Router history={history}>
      <AboutCertificatePanel />
    </Router>
  )
  act(() => {
    store.dispatch(updateCertificate(fakeCertificate({ metadata: fakeCertificateMetaData({ description: descriptionWithLinks }) })))
  })
}

describe('CertificateSidePanel', () => {
  it('renders without crashing', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('renders with description', () => {
    renderComponent()
    expect(screen.getByText(text1)).toBeInTheDocument()
    expect(screen.getByText(text2)).toBeInTheDocument()
    expect(screen.getByText(text3)).toBeInTheDocument()
  })
})
