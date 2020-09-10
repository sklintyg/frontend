import React from 'react'
import { render } from '@testing-library/react'
import AppHeader from './AppHeader'

it('render a label', (): void => {
  const { getByText } = render(<AppHeader title="Webcert" />)
  getByText(/Webcert/i)
})
