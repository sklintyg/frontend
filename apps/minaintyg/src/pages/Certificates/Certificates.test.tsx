import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../store/store'
import { Certificates } from './Certificates'

it('Should have correct heading', () => {
  render(
    <Provider store={store}>
      <Certificates />
    </Provider>
  )
  expect(screen.getByRole('heading', { level: 1 })).toMatchSnapshot()
})

it('Should have correct paragraph', () => {
  render(
    <Provider store={store}>
      <Certificates />
    </Provider>
  )
  expect(screen.getByText(/här listas dina läkarintyg/i)).toMatchSnapshot()
})
