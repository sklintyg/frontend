import { render, screen } from '@testing-library/react'
import React from 'react'
import PatientListInfoContent from '../PatientListInfoContent'

const PATIENT_ID = 'patientId'

const renderComponent = (protectedPerson: boolean, deceased: boolean, testIndicated: boolean) => {
  render(<PatientListInfoContent info={getInfo(protectedPerson, deceased, testIndicated)} />)
}

describe('PatientListInfoContent', () => {
  it('should render person id', () => {
    renderComponent(false, false, false)
    expect(screen.getByText(PATIENT_ID)).toBeInTheDocument()
  })

  it('should render protected person symbol', () => {
    renderComponent(true, false, false)
    expect(screen.getByLabelText('skyddade personuppgifter', { exact: false })).toBeInTheDocument()
  })

  it('should render deceased symbol', () => {
    renderComponent(false, true, false)
    expect(screen.getByLabelText('avliden', { exact: false })).toBeInTheDocument()
  })

  it('should render test indicated symbol', () => {
    renderComponent(false, false, true)
    expect(screen.getByLabelText('valideringsperson', { exact: false })).toBeInTheDocument()
  })

  it('should render no symbol if patient info has no flags', () => {
    renderComponent(false, false, false)
    expect(screen.queryByLabelText('avliden', { exact: false })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('skyddade personuppgifter', { exact: false })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('valideringsperson', { exact: false })).not.toBeInTheDocument()
  })
})

const getInfo = (protectedPerson: boolean, deceased: boolean, testIndicated: boolean) => {
  return {
    id: PATIENT_ID,
    protectedPerson: protectedPerson,
    deceased: deceased,
    testIndicated: testIndicated,
  }
}
