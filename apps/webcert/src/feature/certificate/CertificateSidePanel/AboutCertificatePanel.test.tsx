import { render, screen } from '@testing-library/react'
import faker from 'faker'
import * as redux from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import { fakeCertificateMetaData } from '../../../faker'
import { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import AboutCertificatePanel from './AboutCertificatePanel'

const text1 = faker.lorem.sentence(10)
const text2 = faker.lorem.sentence(10)
const text3 = faker.lorem.sentence(10)
const link1 = faker.lorem.word()
const link2 = faker.lorem.word()

const descriptionWithLinks = `${text1} <LINK:${link1}> ${text2} <LINK:${link2}> ${text3}`
const renderComponent = () => {
  render(
    <MemoryRouter>
      <AboutCertificatePanel />
    </MemoryRouter>
  )
}

describe('CertificateSidePanel', () => {
  beforeEach(() => {
    const useSelectorSpy = vi.spyOn(redux, 'useSelector')
    useSelectorSpy.mockReturnValue(fakeCertificateMetaData({ description: descriptionWithLinks }))
  })

  afterEach(() => {
    clearDispatchedActions()
  })

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
