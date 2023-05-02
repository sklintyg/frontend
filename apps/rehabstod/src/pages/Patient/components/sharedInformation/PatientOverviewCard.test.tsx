import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
const renderComponent = () => {
  render(<PatientOverviewCard title={TITLE} subTitle={SUB_TITLE} description={DESCRIPTION} items={ITEMS} />)
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
      expect(screen.getByText('Visa mig')).toBeInTheDocument()
    })

    describe('expanded', () => {
      beforeEach(async () => {
        renderComponent()
        await userEvent.click(screen.getByText('Visa mig'))
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
        expect(screen.queryByText('Visa mig')).not.toBeInTheDocument()
      })
    })
  })

  describe('has no information', () => {
    beforeEach(() => {
      render(<PatientOverviewCard title={TITLE} subTitle={SUB_TITLE} description={DESCRIPTION} items={[]} />)
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
      expect(screen.queryByText('Visa mig')).not.toBeInTheDocument()
    })
  })
})
