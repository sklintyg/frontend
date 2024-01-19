import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { fakeCauseOfDeathListElement } from '../../../../faker'
import store from '../../../../store/store'
import {
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  ValueCode,
  ValueDate,
  ValueText,
} from '../../../../types'
import UeCauseOfDeathList from './UeCauseOfDeathList'

const DESCRIPTION_LABEL = 'Beskrivning'
const DEBUT_LABEL = 'Ungefärlig debut'
const SPECIFICATION_LABEL = 'Specificera tillståndet'
const ADD_BUTTON_TEXT = 'Lägg till sjukdom/skada'
const VALIDATION_ERROR = 'Ange ett svar'
const QUESTION_ID = 'list'

const question: CertificateDataElement = fakeCauseOfDeathListElement({
  id: QUESTION_ID,
  validation: [
    {
      type: CertificateDataValidationType.MANDATORY_VALIDATION,
      questionId: 'checkbox',
      expression: `$undersokningAvPatienten`,
    },
  ],
  validationErrors: [{ category: 'category', field: '', text: VALIDATION_ERROR, id: QUESTION_ID, type: 'type' }],
})[QUESTION_ID]

const renderComponent = (props: ComponentProps<typeof UeCauseOfDeathList>) => {
  render(
    <Provider store={store}>
      <UeCauseOfDeathList {...props} />
    </Provider>
  )
}

describe('Cause of death component', () => {
  it('renders without crashing', () => {
    expect(() => renderComponent({ disabled: false, question })).not.toThrow()
  })

  it('renders all components', () => {
    renderComponent({ disabled: false, question })
    expect(screen.getAllByLabelText(DESCRIPTION_LABEL)).toHaveLength(1)
    expect(screen.getAllByLabelText(DEBUT_LABEL)).toHaveLength(1)
    expect(screen.getAllByLabelText(SPECIFICATION_LABEL)).toHaveLength(1)
  })

  it('renders, textinput, calendar button and drop down', () => {
    renderComponent({ disabled: false, question })
    const descriptions = screen.getAllByLabelText(DESCRIPTION_LABEL)
    const specifications = screen.getAllByLabelText(SPECIFICATION_LABEL)
    const dates = screen.getAllByLabelText(DEBUT_LABEL)
    descriptions.forEach((description) => {
      expect(description).toBeInTheDocument()
    })
    specifications.forEach((specification) => {
      expect(specification).toBeInTheDocument()
    })
    dates.forEach((date) => {
      expect(date).toBeInTheDocument()
    })
  })

  it('renders component with correct default values', () => {
    const description: ValueText = { type: CertificateDataValueType.TEXT, id: '1', text: 'Description text' }
    const debut: ValueDate = { type: CertificateDataValueType.DATE, id: '1', date: '2020-02-20' }
    const specification: ValueCode = { type: CertificateDataValueType.CODE, id: '1', code: '' }
    renderComponent({
      disabled: false,
      question: fakeCauseOfDeathListElement({
        id: QUESTION_ID,
        value: {
          list: [
            {
              description,
              debut,
              specification,
            },
          ],
        },
      })[QUESTION_ID],
    })

    expect(screen.getAllByLabelText(DEBUT_LABEL)[0]).toHaveValue('2020-02-20')
    expect(screen.getAllByLabelText(DESCRIPTION_LABEL)[0]).toHaveValue('Description text')
    expect(screen.getAllByLabelText(SPECIFICATION_LABEL)[0]).toHaveValue('')
  })

  it('does not disable component if disabled is not set', () => {
    renderComponent({ disabled: false, question })
    const descriptions = screen.getAllByLabelText(DESCRIPTION_LABEL)
    const specifications = screen.getAllByLabelText(SPECIFICATION_LABEL)
    const buttons = screen.getAllByRole('button')
    const dates = screen.getAllByLabelText(DEBUT_LABEL)
    descriptions.forEach((description) => {
      expect(description).toBeEnabled()
    })
    specifications.forEach((specification) => {
      expect(specification).toBeEnabled()
    })
    dates.forEach((date) => {
      expect(date).toBeEnabled()
    })
    buttons.forEach((button) => {
      expect(button).toBeEnabled()
    })
  })

  it('Disable component if disabled is set', () => {
    renderComponent({ disabled: true, question })
    const descriptions = screen.getAllByLabelText(DESCRIPTION_LABEL)
    const specifications = screen.getAllByLabelText(SPECIFICATION_LABEL)
    const buttons = screen.getAllByRole('button')
    const dates = screen.getAllByLabelText(DEBUT_LABEL)
    descriptions.forEach((description) => {
      expect(description).toBeDisabled()
    })
    specifications.forEach((specification) => {
      expect(specification).toBeDisabled()
    })
    dates.forEach((date) => {
      expect(date).toBeDisabled()
    })
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  it('formats input into yyyy-mm-dd', () => {
    renderComponent({ disabled: false, question })
    const dates = screen.getAllByLabelText(DEBUT_LABEL)
    const inputDate = '20200202'
    const expected = '2020-02-02'
    dates.forEach(async (date) => {
      await userEvent.clear(date)
      await userEvent.type(date, inputDate)
      expect(date).toHaveValue(expected)
    })
  })

  it('should add new row when button is clicked', async () => {
    renderComponent({ disabled: false, question })
    const button = screen.getByLabelText(ADD_BUTTON_TEXT)
    await userEvent.click(button)
    expect(screen.getAllByLabelText(DESCRIPTION_LABEL)).toHaveLength(2)
    expect(screen.getAllByLabelText(DEBUT_LABEL)).toHaveLength(2)
    expect(screen.getAllByLabelText(SPECIFICATION_LABEL)).toHaveLength(2)
  })

  it('should not add more than 7 rows', async () => {
    renderComponent({ disabled: false, question })
    const button = screen.getByLabelText(ADD_BUTTON_TEXT)
    await userEvent.click(button)
    await userEvent.click(button)
    await userEvent.click(button)
    await userEvent.click(button)
    await userEvent.click(button)
    await userEvent.click(button)
    expect(screen.getAllByLabelText(DESCRIPTION_LABEL)).toHaveLength(7)
    expect(screen.getAllByLabelText(DEBUT_LABEL)).toHaveLength(7)
    expect(screen.getAllByLabelText(SPECIFICATION_LABEL)).toHaveLength(7)
    expect(button).toBeEnabled()
    await userEvent.click(button)
    expect(screen.getAllByLabelText(DESCRIPTION_LABEL)).toHaveLength(8)
    expect(screen.getAllByLabelText(DEBUT_LABEL)).toHaveLength(8)
    expect(screen.getAllByLabelText(SPECIFICATION_LABEL)).toHaveLength(8)
    expect(button).toBeDisabled()
  })
})
