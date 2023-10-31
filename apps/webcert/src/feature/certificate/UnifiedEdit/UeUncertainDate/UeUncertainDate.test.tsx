import { fakeCertificate, fakeUncertainDateElement } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { updateCertificate } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import UeUncertainDate from './UeUncertainDate'

const YEARS = ['2020', '2021', '2022']
const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

let testStore: EnhancedStore

const question = fakeUncertainDateElement({
  id: '1',
  config: {
    allowedYears: YEARS,
    unknownYear: true,
    unknownMonth: true,
  },
  value: {
    value: null,
  },
})['1']

const renderComponent = (props: ComponentProps<typeof UeUncertainDate>) => {
  testStore.dispatch(
    updateCertificate(
      fakeCertificate({
        data: {
          [props.question.id]: props.question,
        },
      })
    )
  )
  render(
    <Provider store={testStore}>
      <UeUncertainDate {...props} />
    </Provider>
  )
}

describe('UeUncertainDate', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([certificateMiddleware])
  })

  it('Renders element', () => {
    expect(() => renderComponent({ question })).not.toThrow()
  })

  it('renders control and all options', () => {
    renderComponent({ question })
    const yearDropdown = screen.getByLabelText('År')
    expect(yearDropdown).toBeInTheDocument()
    expect(yearDropdown).toBeEnabled()
    expect(within(yearDropdown).getAllByRole('option')).toHaveLength(YEARS.length + 2)

    const monthDropdown = screen.getByLabelText('Månad')
    expect(monthDropdown).toBeInTheDocument()
    expect(monthDropdown).toBeDisabled()
    expect(within(monthDropdown).getAllByRole('option')).toHaveLength(14)

    const dayText = screen.getByLabelText('Dag')
    expect(dayText).toBeInTheDocument()
    expect(dayText).toBeDisabled()
  })

  it('lets user choose option', async () => {
    renderComponent({ question })
    const yearDropdown = screen.getByLabelText('År')
    const yearOptions = within(yearDropdown).getAllByRole('option') as HTMLOptionElement[]
    const monthDropdown = screen.getByLabelText('Månad')
    const monthOptions = within(monthDropdown).getAllByRole('option') as HTMLOptionElement[]
    expect(yearDropdown).toHaveValue('')
    expect(yearOptions[0].selected).toBeTruthy()
    expect(yearOptions[2].selected).toBeFalsy()

    await userEvent.click(yearDropdown)
    await userEvent.selectOptions(yearDropdown, YEARS[0])
    expect(yearDropdown).toHaveValue(YEARS[0])
    expect(yearOptions[2].selected).toBeTruthy()
    expect(yearOptions[0].selected).toBeFalsy()
    expect(monthDropdown).toBeEnabled()
    expect(monthDropdown).toHaveValue('')
    expect(monthOptions[0].selected).toBeTruthy()
    expect(monthOptions[2].selected).toBeFalsy()

    await userEvent.click(monthDropdown)
    await userEvent.selectOptions(monthDropdown, MONTHS[0])
    expect(monthOptions[2].selected).toBeTruthy()
    expect(monthOptions[0].selected).toBeFalsy()

    await userEvent.click(yearDropdown)
    await userEvent.selectOptions(yearDropdown, '0000')
    expect(yearDropdown).toHaveValue('0000')
    expect(yearOptions[1].selected).toBeTruthy()
    expect(yearOptions[0].selected).toBeFalsy()
    expect(monthDropdown).toBeDisabled()
    expect(monthDropdown).toHaveValue('00')
    expect(monthOptions[1].selected).toBeTruthy()
    expect(monthOptions[0].selected).toBeFalsy()
  })

  it('gets disabled correctly', () => {
    renderComponent({ question, disabled: true })
    const yearDropdown = screen.getByLabelText('År')
    expect(yearDropdown).toBeDisabled()
    const monthDropdown = screen.getByLabelText('Månad')
    expect(monthDropdown).toBeDisabled()
  })
})
