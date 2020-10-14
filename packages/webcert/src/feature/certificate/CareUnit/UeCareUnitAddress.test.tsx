import React from 'react'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import UeCareUnitAddress from './UeCareUnitAddress'

it('displays all input fields with labels', (): void => {
  const useSelectorSpy = jest.spyOn(redux, 'useSelector')
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue({})
  useSelectorSpy.mockReturnValue({})

  render(<UeCareUnitAddress />)

  screen.getByRole('heading', { name: /vårdenhetens adress/i })
  screen.getByText(/postadress/i)
  screen.getByRole('textbox', { name: /postadress/i })
  screen.getByText(/postnummer/i)
  screen.getByRole('textbox', { name: /postnummer/i })
  screen.getByText(/postort/i)
  screen.getByRole('textbox', { name: /postort/i })
  screen.getByText(/telefonnummer/i)
  screen.getByRole('textbox', { name: /telefonnummer/i })
})
