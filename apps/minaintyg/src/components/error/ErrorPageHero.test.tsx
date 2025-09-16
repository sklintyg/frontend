import { faker } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { ErrorType } from '../../schema/error.schema'
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

it.each(ErrorType.options)('Should render %s type error', (type) => {
  faker.seed(1234)
  const { container } = render(
    <Provider store={store}>
      <MemoryRouter>
        <ErrorPageHero type={type} />
      </MemoryRouter>
    </Provider>
  )
  expect(container).toMatchSnapshot()
})
