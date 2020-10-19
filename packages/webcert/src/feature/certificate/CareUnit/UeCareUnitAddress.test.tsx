import React from 'react'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import UeCareUnitAddress from './UeCareUnitAddress'

it('displays all input fields with labels', (): void => {
  const useSelectorSpy = jest.spyOn(redux, 'useSelector')
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(jest.fn())
  useSelectorSpy.mockReturnValue({})

  render(<UeCareUnitAddress />)

  expect(screen.getByRole('heading', { name: /vårdenhetens adress/i })).toBeInTheDocument()
  expect(screen.getByText(/postadress/i)).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: /postadress/i })).toBeInTheDocument()
  expect(screen.getByText(/postnummer/i)).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: /postnummer/i })).toBeInTheDocument()
  expect(screen.getByText(/postort/i)).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: /postort/i })).toBeInTheDocument()
  expect(screen.getByText(/telefonnummer/i)).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: /telefonnummer/i })).toBeInTheDocument()
})
