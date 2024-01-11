import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { expect, it, describe, beforeEach } from 'vitest'
import SystemBanners from './SystemBanners'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import { updateConfig } from '../../store/utils/utilsActions'
import { Configuration } from '../../store/utils/utilsReducer'

let testStore: EnhancedStore

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <SystemBanners />
    </Provider>
  )
}

const INFO_TEXT = 'Detta är ett informationsmeddelande.'

const setState = () => {
  testStore.dispatch(updateConfig({ version: '1.0', banners: [{ message: INFO_TEXT, priority: 'HOG' }] } as Configuration))
}

describe('SystemBanners', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([])
  })

  it('shall render banner if it exists in state', () => {
    setState()
    renderDefaultComponent()
    expect(screen.getByText(INFO_TEXT)).toBeInTheDocument()
  })

  it('shall not render a banner if empty state', () => {
    renderDefaultComponent()
    expect(screen.queryByText(INFO_TEXT)).not.toBeInTheDocument()
  })
})
