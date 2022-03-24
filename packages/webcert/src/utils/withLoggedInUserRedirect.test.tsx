import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import App from '../App'
import { render } from '@testing-library/react'

describe('Test redirect after login', () => {
  let fakeAxios: MockAdapter

  it('shall redirect logged in doctor to /create', () => {
    fakeAxios = new MockAdapter(axios)
    fakeAxios.onGet('/api').reply(200)
    render(<App />)

    //Something something ...
  })
})

//Create user or doctor or administrator?
const createDoctor = () => {
  return {
    user: null,
    inactiveAutomaticLogout: false,
    isLoadingUser: false,
  }
}
