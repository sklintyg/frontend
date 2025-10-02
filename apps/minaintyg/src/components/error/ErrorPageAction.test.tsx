import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { ErrorPageActionType } from '../../schema/error.schema'
import { api } from '../../store/api'
import { startSession } from '../../store/slice/session.slice'
import { store } from '../../store/store'
import { ErrorPageAction } from './ErrorPageAction'

it.each(ErrorPageActionType.options)('Should render %s type action', async (type) => {
  store.dispatch(startSession())
  await store.dispatch(api.endpoints.getInfo.initiate())
  const { container } = render(
    <Provider store={store}>
      <MemoryRouter>
        <ErrorPageAction type={type} />
      </MemoryRouter>
    </Provider>
  )
  expect(container).toMatchSnapshot()
})
