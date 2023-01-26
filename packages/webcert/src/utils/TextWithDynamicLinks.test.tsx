import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import faker from 'faker'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { certificateMiddleware } from '../store/certificate/certificateMiddleware'
import reducer from '../store/reducers'
import dispatchHelperMiddleware from '../store/test/dispatchHelperMiddleware'
import TextWithDynamicLinks from './TextWithDynamicLinks'
let testStore: EnhancedStore

const history = createMemoryHistory()

const text1 = faker.lorem.sentence(10)
const text2 = faker.lorem.sentence(10)
const text3 = faker.lorem.sentence(10)
const link1 = faker.lorem.word()
const link2 = faker.lorem.word()

const textWithLinks = `${text1} <LINK:${link1}> ${text2} <LINK:${link2}> ${text3}`

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <TextWithDynamicLinks text={textWithLinks} />
      </Router>
    </Provider>
  )
}
describe('TextWithDynamicLinks', () => {
  testStore = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, certificateMiddleware),
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
})
