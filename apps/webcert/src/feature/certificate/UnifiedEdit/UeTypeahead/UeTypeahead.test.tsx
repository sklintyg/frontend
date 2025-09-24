import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import type { EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { fakeCertificate, fakeTypeaheadElement } from '../../../../faker'
import { updateCertificate } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { getQuestion } from '../../../../store/certificate/certificateSelectors'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import { utilsMiddleware } from '../../../../store/utils/utilsMiddleware'
import UeTypeahead from './UeTypeahead'

const question = fakeTypeaheadElement({ id: '1' })['1']

let testStore: EnhancedStore

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <UeTypeahead question={question} disabled={false} />
    </Provider>
  )
}

const renderWithSuggestions = () => {
  render(
    <Provider store={testStore}>
      <UeTypeahead question={question} disabled />
    </Provider>
  )
}

const checkListVisibility = (visible: boolean) => {
  const listItems = screen.queryAllByRole('option')
  if (visible) {
    expect(listItems).toHaveLength(60)
  } else {
    expect(listItems).toHaveLength(0)
  }
}

describe('Typeahead component', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([certificateMiddleware, utilsMiddleware])
    testStore.dispatch(updateCertificate(fakeCertificate({ data: { '1': question } })))
  })

  it('renders without crashing', () => {
    expect(() => renderDefaultComponent()).not.toThrow()
  })

  it('does not render suggestions when array is empty', () => {
    renderDefaultComponent()
    const list = screen.queryByRole('list')
    expect(list).not.toBeInTheDocument()
  })

  it('disables component if disabled is set', async () => {
    renderWithSuggestions()
    const input = screen.getByRole('textbox')
    await expect(input).toBeDisabled()
  })

  it('shows results when users types text', async () => {
    renderDefaultComponent()
    const testinput = 'Ö'
    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    checkListVisibility(false)
    await userEvent.type(input, testinput)
    checkListVisibility(true)
    await expect(input).toHaveValue(testinput)
    checkListVisibility(true)
  })

  it('does not dispatch results when users text is not changed, even after wait', async () => {
    renderDefaultComponent()
    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'Ö')
    await userEvent.clear(input)
    await userEvent.type(input, 'Ö')
    expect(getQuestion('1')(testStore.getState())).toMatchObject({ value: { text: null } })
  })

  it('Render correct suggestions', async () => {
    renderDefaultComponent()
    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'ors')
    const listItems = screen.queryAllByRole('option')
    expect(listItems[0].title).toBe('ORSA')
    expect(listItems[1].title).toBe('BENGTSFORS')
    expect(listItems[2].title).toBe('DEGERFORS')
    expect(listItems[3].title).toBe('FORSHAGA')
    expect(listItems[4].title).toBe('HAGFORS')
  })
})
