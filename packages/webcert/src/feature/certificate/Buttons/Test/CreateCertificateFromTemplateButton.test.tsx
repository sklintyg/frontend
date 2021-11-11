import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as redux from 'react-redux'
import { CertificateMetadata } from '@frontend/common'
import CreateCertificateFromTemplateButton from '../CreateCertificateFromTemplateButton'

const NAME = 'Template button name'
const DESCRIPTION = 'Template button description'
const BODY = 'Template button body'

//@ts-expect-error creating object so component renders
const certificateMetadata: CertificateMetadata = {}

const renderDefaultComponent = (enabled: boolean) => {
  render(
    <CreateCertificateFromTemplateButton
      certificateMetadata={certificateMetadata}
      name={NAME}
      description={DESCRIPTION}
      body={BODY}
      enabled={enabled}
    />
  )
}

beforeEach(() => {
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(jest.fn())
})

describe('Create certificate from template button', () => {
  it('shall render without crashing', () => {
    renderDefaultComponent(true)
  })

  it('shall disable button', () => {
    renderDefaultComponent(false)
    const button = screen.queryByRole('button')
    expect(button).toBeDisabled()
  })

  it('shall enable button', () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button')
    expect(button).toBeEnabled()
  })

  it('shall set name for button', () => {
    renderDefaultComponent(true)
    expect(screen.getByText(NAME)).toBeInTheDocument()
  })

  it('shall set description for button', () => {
    renderDefaultComponent(true)
    userEvent.hover(screen.getByText(NAME))
    expect(screen.getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it('shall not show modal if button is not pressed', () => {
    renderDefaultComponent(true)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByText(BODY)).not.toBeInTheDocument()
  })

  it('renders modal when button is clicked', () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button') as HTMLButtonElement
    userEvent.click(button)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(BODY)).toBeInTheDocument()
  })
})
