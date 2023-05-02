import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { PatientOverviewCard } from './PatientOverviewCard'

const TITLE = 'Title'
const SUB_TITLE = 'Sub title'
const DESCRIPTION = 'Description'

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
const ITEMS = [ITEM_1, ITEM_2]

let onGetInformation: (id: string) => void

const renderComponent = () => {
  onGetInformation = vi.fn()
  render(
    <PatientOverviewCard title={TITLE} subTitle={SUB_TITLE} description={DESCRIPTION} items={ITEMS} onGetInformation={onGetInformation} />
  )
}

describe('PatientOverviewCard', () => {
  it('should render component without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    renderComponent()
    expect(screen.getByText(TITLE)).toBeInTheDocument()
  })

  it('should not show sub title if not expanded', () => {
    expect(screen.queryByText(SUB_TITLE)).not.toBeInTheDocument()
  })

  describe('has information', () => {
    it('should show description', () => {
      renderComponent()
      expect(screen.getByText(DESCRIPTION)).toBeInTheDocument()
    })

    it('should show expand button', () => {
      renderComponent()
      expect(screen.getByText('Visa')).toBeInTheDocument()
    })

    describe('expanded', () => {
      beforeEach(async () => {
        renderComponent()
        await userEvent.click(screen.getByText('Visa'))
      })

      it('should show title', () => {
        expect(screen.getByText(TITLE)).toBeInTheDocument()
      })

      it('should not show description', () => {
        expect(screen.queryByText(DESCRIPTION)).not.toBeInTheDocument()
      })

      it('should show sub title', () => {
        expect(screen.getByText(SUB_TITLE)).toBeInTheDocument()
      })

      it('should show list of items', () => {
        expect(screen.getByText(ITEMS[0].itemName)).toBeInTheDocument()
        expect(screen.getByText(ITEMS[1].itemName)).toBeInTheDocument()
      })

      it('should show button to get patient information for each item', () => {
        expect(screen.getAllByText('Hämta')).toHaveLength(ITEMS.length)
      })

      it('should not show expand button', () => {
        expect(screen.queryByText('Visa')).not.toBeInTheDocument()
      })

      it('should call on get information when clicking get button', async () => {
        await userEvent.click(screen.getAllByText('Hämta')[0])
        expect(onGetInformation).toHaveBeenCalledTimes(1)
        expect(onGetInformation).toHaveBeenCalledWith(ITEMS[0].itemId)
      })
    })
  })

  describe('has no information', () => {
    beforeEach(() => {
      onGetInformation = vi.fn()
      render(
        <PatientOverviewCard title={TITLE} subTitle={SUB_TITLE} description={DESCRIPTION} items={[]} onGetInformation={onGetInformation} />
      )
    })

    it('should show title', () => {
      expect(screen.getByText(TITLE)).toBeInTheDocument()
    })

    it('should not show sub title', () => {
      expect(screen.queryByText(SUB_TITLE)).not.toBeInTheDocument()
    })

    it('should show no information description', () => {
      expect(screen.getByText('Det finns för tillfället ingen information i denna kategori att inhämta.')).toBeInTheDocument()
    })

    it('should not show regular description', () => {
      expect(screen.queryByText(DESCRIPTION)).not.toBeInTheDocument()
    })

    it('should not show expand button', () => {
      expect(screen.queryByText('Visa')).not.toBeInTheDocument()
    })
  })
})
