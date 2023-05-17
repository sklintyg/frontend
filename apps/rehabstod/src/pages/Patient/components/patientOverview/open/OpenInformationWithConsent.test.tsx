import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
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
  beforeEach(() => {
    onGiveConsent = vi.fn()
    onGetInformation = vi.fn()
  })

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
    })

    it('should show button to get patient information for each item that does not have includedInSjukfall true', () => {
      expect(screen.getAllByText('Hämta')).toHaveLength(1)
    })

    it('should not render form', () => {
      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
      expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    })

    it('should not render buttons', () => {
      expect(screen.queryByText('Avbryt')).not.toBeInTheDocument()
      expect(screen.queryByText('Patienten ger samtycke')).not.toBeInTheDocument()
    })

    it('should not render information link', () => {
      expect(screen.queryByText('Om samtycke och sammanhållen vårddokumentation')).not.toBeInTheDocument()
    })
  })

  describe('hasNoConsent', () => {
    beforeEach(() => {
      renderComponent(false)
    })

    it('should render list of items', () => {
      expect(screen.getByText(ITEMS[0].itemName, { exact: false })).toBeInTheDocument()
      expect(screen.getByText(ITEMS[1].itemName, { exact: false })).toBeInTheDocument()
      expect(screen.getByText(ITEMS[2].itemName, { exact: false })).toBeInTheDocument()
    })

    it('should render form', () => {
      expect(screen.getByRole('spinbutton')).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
      expect(screen.getAllByRole('radio')).toHaveLength(2)
    })

    it('should have checkbox as unchecked as default', () => {
      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })

    it('should have radio button for only user checked as default', () => {
      expect(screen.getByLabelText('Bara jag')).toBeChecked()
      expect(screen.getByLabelText('All behörig personal på vårdenheten')).not.toBeChecked()
    })

    it('should have default value 7 for number of days of consent', () => {
      expect(screen.getByRole('spinbutton')).toHaveValue(7)
    })

    it('should render buttons', () => {
      expect(screen.queryByText('Avbryt')).toBeInTheDocument()
      expect(screen.queryByText('Patienten ger samtycke')).toBeInTheDocument()
    })

    it('should render information link', () => {
      expect(screen.getByText('Om samtycke och sammanhållen vårddokumentation')).toBeInTheDocument()
    })

    it('should render error if pressing button without checking checkbox', async () => {
      await userEvent.click(screen.getByText('Patienten ger samtycke'))
      expect(screen.getByText('Du behöver kryssa i rutan för att kunna fortsätta')).toBeInTheDocument()
    })

    it('should not call give consent if pressing button without checking checkbox', async () => {
      await userEvent.click(screen.getByText('Patienten ger samtycke'))
      expect(onGiveConsent).not.toHaveBeenCalled()
    })

    it('should call give consent if pressing button with checked checkbox', async () => {
      await userEvent.click(screen.getByRole('checkbox'))
      await userEvent.click(screen.getByText('Patienten ger samtycke'))
      expect(onGiveConsent).toHaveBeenCalledTimes(1)
    })
  })
})
