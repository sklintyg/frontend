import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, describe, vi } from 'vitest'
import { OpenInformation } from './OpenInformation'

const ITEM_1 = {
  bidrarTillAktivtSjukfall: true,
  includedInSjukfall: true,
  itemName: 'Name 1',
  itemId: 'Id1',
  itemType: 'VARDGIVARE',
}

const ITEM_2 = {
  bidrarTillAktivtSjukfall: true,
  includedInSjukfall: true,
  itemName: 'Name 2',
  itemId: 'Id2',
  itemType: 'VARDGIVARE',
}

const ITEM_3 = {
  bidrarTillAktivtSjukfall: true,
  includedInSjukfall: false,
  itemName: 'Name 3',
  itemId: 'Id3',
  itemType: 'VARDGIVARE',
}

const ITEMS = [ITEM_1, ITEM_2, ITEM_3]

let onGetInformation: (id: string) => void

const renderComponent = () => {
  onGetInformation = vi.fn()
  render(<OpenInformation items={ITEMS} onGetInformation={onGetInformation} />)
}

describe('OpenInformation', () => {
  it('should render component without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show list of items', () => {
    renderComponent()
    expect(screen.getByText(ITEMS[0].itemName)).toBeInTheDocument()
    expect(screen.getByText(ITEMS[1].itemName)).toBeInTheDocument()
    expect(screen.getByText(ITEMS[2].itemName)).toBeInTheDocument()
  })

  it('should show button to get patient information for each item that has includedInAktivtSjukfall false', () => {
    renderComponent()
    expect(screen.getAllByText('Hämta')).toHaveLength(1)
  })

  it('should show message of gotten information for each item that has includedInAktivtSjukfall true', () => {
    renderComponent()
    expect(screen.getAllByText('Hämtat')).toHaveLength(2)
  })

  it('should call on get information when clicking get button', async () => {
    renderComponent()
    await userEvent.click(screen.getAllByText('Hämta')[0])
    expect(onGetInformation).toHaveBeenCalledTimes(1)
    expect(onGetInformation).toHaveBeenCalledWith(ITEMS[2].itemId)
  })
})
