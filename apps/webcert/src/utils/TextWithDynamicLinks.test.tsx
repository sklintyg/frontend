import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import faker from 'faker'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { certificateMiddleware } from '../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../store/test/dispatchHelperMiddleware'
import { updateDynamicLinks } from '../store/utils/utilsActions'
import { utilsMiddleware } from '../store/utils/utilsMiddleware'
import TextWithDynamicLinks from './TextWithDynamicLinks'

let testStore: EnhancedStore

const history = createMemoryHistory()

const text1 = faker.lorem.sentence(10)
const text2 = faker.lorem.sentence(10)
const text3 = faker.lorem.sentence(10)
const link1 = 'link1'
const link2 = 'link2'

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
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, certificateMiddleware, utilsMiddleware])

    testStore.dispatch(
      updateDynamicLinks({
        link1: { key: 'link1', url: 'https://www.inera.se', text: 'Inera', target: '_self', tooltip: 'inera' },
        link2: { key: 'link2', url: 'https://www.soprasteria.se', text: 'Sopra Steria', target: '_self', tooltip: 'sopra' },
      })
    )
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
    expect(screen.getByText('Inera')).toBeInTheDocument()
    expect(screen.getByText('Sopra Steria')).toBeInTheDocument()
  })
})
