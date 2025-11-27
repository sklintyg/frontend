import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import store from '../../store/store'
import { PPRegistrationDone } from './PPRegistrationDone'

it('should render without issues', () => {
  expect(() =>
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/done']}>
          <Routes>
            <Route path="/done" element={<PPRegistrationDone />} />
            <Route path="/" element="Start" />
          </Routes>
        </MemoryRouter>
      </Provider>
    )
  ).not.toThrow()
})
