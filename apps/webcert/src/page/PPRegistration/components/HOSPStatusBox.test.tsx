import { render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Provider } from 'react-redux'
import { ppApi } from '../../../store/pp/ppApi'
import store from '../../../store/store'
import { HOSPStatusBox } from './HOSPStatusBox'

let fakeAxios: MockAdapter

describe('HOSPStatusBox', () => {
  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
  })

  it('Should display status when HOSP data is missing', async () => {
    fakeAxios.onGet('/api/private-practitioner/hospInformation').reply(200, {
      personalPrescriptionCode: null,
      licensedHealthcareProfessions: [],
      specialities: [],
    })
    render(
      <Provider store={store}>
        <HOSPStatusBox />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText(/inga uppgifter har hämtats/i)).toBeInTheDocument()
    })
  })

  it('Should display status when HOSP failes to load', async () => {
    fakeAxios.onGet('/api/private-practitioner/hospInformation').reply(500)
    render(
      <Provider store={store}>
        <HOSPStatusBox />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText(/inga uppgifter har hämtats/i)).toBeInTheDocument()
    })
  })

  it('Should not render anything when HOSP information is available', async () => {
    fakeAxios.onGet('/api/private-practitioner/hospInformation').reply(200, {
      personalPrescriptionCode: 'HOSP-2025-789456',
      licensedHealthcareProfessions: [{ code: 'MD', description: 'Medical Doctor' }],
      specialities: [{ code: 'CAR', description: 'Cardiology' }],
    })
    const { container } = render(
      <Provider store={store}>
        <HOSPStatusBox />
      </Provider>
    )

    await waitFor(() => {
      const { isSuccess } = ppApi.endpoints.getHOSPInformation.select()(store.getState())
      expect(isSuccess).toBe(true)
    })

    expect(container).toBeEmptyDOMElement()
  })
})
