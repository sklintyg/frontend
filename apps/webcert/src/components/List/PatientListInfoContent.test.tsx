import { render, screen } from '@testing-library/react'
import PatientListInfoContent from './PatientListInfoContent'

const PATIENT_ID = '191212121212'
const FORMATTED_PATIENT_ID = '19121212-1212'

const getInfo = (protectedPerson: boolean, deceased: boolean, testIndicated: boolean) => ({
  id: PATIENT_ID,
  protectedPerson,
  deceased,
  testIndicated,
})

const renderComponent = (protectedPerson: boolean, deceased: boolean, testIndicated: boolean) => {
  render(<PatientListInfoContent info={getInfo(protectedPerson, deceased, testIndicated)} />)
}

describe('PatientListInfoContent', () => {
  it('should render person id', () => {
    renderComponent(false, false, false)
    expect(screen.getByText(FORMATTED_PATIENT_ID)).toBeInTheDocument()
  })

  it('should render protected person symbol', () => {
    renderComponent(true, false, false)
    expect(screen.getByAltText('skyddade personuppgifter', { exact: false })).toBeInTheDocument()
  })

  it('should render deceased symbol', () => {
    renderComponent(false, true, false)
    expect(screen.getByAltText('avliden', { exact: false })).toBeInTheDocument()
  })

  it('should render test indicated symbol', () => {
    renderComponent(false, false, true)
    expect(screen.getByAltText('valideringsperson', { exact: false })).toBeInTheDocument()
  })

  it('should render no symbol if patient info has no flags', () => {
    renderComponent(false, false, false)
    expect(screen.queryByAltText('avliden', { exact: false })).not.toBeInTheDocument()
    expect(screen.queryByAltText('skyddade personuppgifter', { exact: false })).not.toBeInTheDocument()
    expect(screen.queryByAltText('valideringsperson', { exact: false })).not.toBeInTheDocument()
  })
})
