import { render, screen } from '@testing-library/react'
import { OpenInformationWithConsent } from './OpenInformationWithConsent'

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
let onGiveConsent: (days: string, onlyCurrentUser: boolean) => void
let onClose: () => void

const renderComponent = (hasConsent: boolean) => {
  render(
    <OpenInformationWithConsent
      items={ITEMS}
      onGetInformation={onGetInformation}
      onGiveConsent={onGiveConsent}
      onClose={onClose}
      hasGivenConsent={hasConsent}
    />
  )
}
describe('OpenInformationWithConsent', () => {
  it('should render without problems', () => {
    expect(() => renderComponent(true)).not.toThrow()
  })

  describe('hasConsent', () => {
    beforeEach(() => {
      renderComponent(true)
    })

    it('should render list of items', () => {
      expect(screen.getByText(ITEMS[0].itemName)).toBeInTheDocument()
      expect(screen.getByText(ITEMS[1].itemName)).toBeInTheDocument()
      expect(screen.getByText(ITEMS[2].itemName)).toBeInTheDocument()
      expect(screen.getByText(ITEMS[3].itemName)).toBeInTheDocument()
    })

    it('should show button to get patient information for each item that does not have includedInSjukfall true', () => {
      expect(screen.getAllByText('Hämta')).toHaveLength(2)
    })

    it('should not render form', () => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
      expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    })

    it('should not render buttons', () => {
      expect(screen.queryByText('Avbryt')).not.toBeInTheDocument()
      expect(screen.queryByText('Patienten ger samtycke')).not.toBeInTheDocument()
    })
  })

  describe('hasNoConsent', () => {
    it('should render list of items', () => {
      expect(screen.getByText(ITEMS[0].itemName)).toBeInTheDocument()
      expect(screen.getByText(ITEMS[1].itemName)).toBeInTheDocument()
      expect(screen.getByText(ITEMS[2].itemName)).toBeInTheDocument()
      expect(screen.getByText(ITEMS[3].itemName)).toBeInTheDocument()
    })
  })
})
