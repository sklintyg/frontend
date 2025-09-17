import { faker } from '@frontend/fake'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { ErrorType } from '../../schema/error.schema'
import { api } from '../../store/api'
import { startSession } from '../../store/slice/session.slice'
import { store } from '../../store/store'
import { ErrorPageHero } from './ErrorPageHero'

it('Should render identifier', () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ErrorPageHero id="037b5ea0-ca66-49dd-abfa-a498dc0b1027" />
      </MemoryRouter>
    </Provider>
  )
  expect(screen.getByText('Om problemet kvarstår, spara nedan id och kontakta')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'support' })).toBeInTheDocument()
  expect(screen.getByText('037b5ea0-ca66-49dd-abfa-a498dc0b1027')).toBeInTheDocument()
})

it.each(ErrorType.options)('Should render %s type error', async (type) => {
  store.dispatch(startSession())
  store.dispatch(api.endpoints.getInfo.initiate())
  faker.seed(1234)
  const { container } = render(
    <Provider store={store}>
      <MemoryRouter>
        <ErrorPageHero type={type} />
      </MemoryRouter>
    </Provider>
  )
  await waitFor(() => expect(api.endpoints.getInfo.select()(store.getState()).data).not.toBeUndefined())
  expect(container).toMatchSnapshot()
})
