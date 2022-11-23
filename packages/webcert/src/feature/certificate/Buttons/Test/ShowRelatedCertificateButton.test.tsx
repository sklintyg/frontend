import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as redux from 'react-redux'
import { CustomTooltip, Unit, User, CertificateMetadata } from '@frontend/common/src'
import ShowRelatedCertificateButton from '../ShowRelatedCertificateButton'

const NAME = 'Show related certificate button name'
const DESCRIPTION = 'Show related certificate button description'
const BODY = 'Show related certificate button body'

const user = ({
  hsaId: '1234abc',
  name: 'Test Testtest',
  loggedInUnit: { unitName: 'testUnit' } as Unit,
  loggedInCareProvider: { unitName: 'testProvider' } as Unit,
  role: 'doctor',
} as unknown) as User

const certificateMetadata = {} as CertificateMetadata

const renderDefaultComponent = (enabled: boolean, functionDisabled = false) => {
  render(
    <>
      <ShowRelatedCertificateButton
        certificateId={certificateMetadata.id}
        name={NAME}
        description={DESCRIPTION}
        enabled={enabled}
        functionDisabled={functionDisabled}
      />
      <CustomTooltip />
    </>
  )
}

beforeEach(() => {
  const useSelectorSpy = jest.spyOn(redux, 'useSelector')
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useSelectorSpy.mockReturnValue(user)
  useDispatchSpy.mockReturnValue(jest.fn())
})

describe('Show related certificate button', () => {
  it('renders without crashing', () => {
    renderDefaultComponent(true)
  })

  it('correctly disables button', () => {
    renderDefaultComponent(false)
    const button = screen.queryByRole('button')
    expect(button).toBeDisabled()
  })

  it('shall disable button if disableFunction is true', () => {
    renderDefaultComponent(false)
    const button = screen.queryByRole('button')
    expect(button).toBeDisabled()
  })

  it('sets correct name for button', () => {
    renderDefaultComponent(true)
    const name = screen.queryByText(NAME)
    expect(name).not.toBeNull()
  })

  it('sets correct description for button', async () => {
    renderDefaultComponent(true)
    await userEvent.hover(screen.getByText(NAME))
    expect(screen.queryByText(DESCRIPTION)).not.toBeNull()
  })

  it('sets correct body for button', () => {
    renderDefaultComponent(true)
    const body = screen.queryByText(BODY)
    expect(body).toBeNull()
  })
})
