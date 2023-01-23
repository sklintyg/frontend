import { fakeCertificateMetaData } from '@frontend/common'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import faker from 'faker'
import { createMemoryHistory } from 'history'
import React from 'react'
import * as redux from 'react-redux'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import reducer from '../../../store/reducers'

import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import AboutCertificatePanel from './AboutCertificatePanel'

let testStore: EnhancedStore

const history = createMemoryHistory()

const text1 = faker.lorem.sentence(10)
const text2 = faker.lorem.sentence(10)
const text3 = faker.lorem.sentence(10)
const link1 = faker.lorem.word()
const link2 = faker.lorem.word()

const descriptionWithLinks = `${text1} <LINK:${link1}> ${text2} <LINK:${link2}> ${text3}`
console.log(descriptionWithLinks)
const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <AboutCertificatePanel headerHeight={500} />
      </Router>
    </Provider>
  )
}

describe('CertificateSidePanel', () => {
  beforeEach(() => {
    const useSelectorSpy = jest.spyOn(redux, 'useSelector')
    useSelectorSpy.mockReturnValue(fakeCertificateMetaData({ description: descriptionWithLinks }))
  })

  testStore = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, certificateMiddleware),
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('renders without crashing', () => {
    renderComponent()
  })

  it('renders with description', () => {
    renderComponent()
    expect(screen.getByText(text1)).toBeInTheDocument()
    expect(screen.getByText(text2)).toBeInTheDocument()
    expect(screen.getByText(text3)).toBeInTheDocument()
  })

  it('renders with description with links', () => {
    renderComponent()
    // how can I check that WCDynamic link is called? With correct parameters?
  })
})
