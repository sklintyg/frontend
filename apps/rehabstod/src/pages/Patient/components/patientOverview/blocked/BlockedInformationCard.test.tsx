import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BlockedInformationCard } from './BlockedInformationCard'

const TITLE = 'Title'
const SUB_TITLE = 'Sub title'
const DESCRIPTION = 'Description'

const ITEMS = ['ITEM_1', 'ITEM_2', 'ITEM_3']

const renderComponent = () => {
  render(<BlockedInformationCard title={TITLE} subTitle={SUB_TITLE} description={DESCRIPTION} items={ITEMS} />)
}

describe('BlockedInformationCard', () => {
  it('should render component without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    renderComponent()
    expect(screen.getByText(TITLE)).toBeInTheDocument()
  })

  it('should show regular description', () => {
    renderComponent()
    expect(screen.getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it('should show expand button', () => {
    renderComponent()
    expect(screen.getByText('Visa')).toBeInTheDocument()
  })

  describe('has information', () => {
    beforeEach(async () => {
      renderComponent()
      await act(() => userEvent.click(screen.getByText('Visa')))
    })

    it('should not show sub title', () => {
      expect(screen.getByText(SUB_TITLE)).toBeInTheDocument()
    })

    it('should not show no information description', () => {
      expect(screen.queryByText('Det finns för tillfället ingen information i denna kategori att inhämta.')).not.toBeInTheDocument()
    })

    it('should show list of items', () => {
      expect(screen.getByText(ITEMS[0])).toBeInTheDocument()
      expect(screen.getByText(ITEMS[1])).toBeInTheDocument()
    })

    it('should not show get information button', () => {
      expect(screen.queryAllByText('Hämta')).toHaveLength(0)
    })

    it('should not show that information has been collected', () => {
      expect(screen.queryAllByText('Hämtad')).toHaveLength(0)
    })
  })

  describe('has no information', () => {
    beforeEach(() => {
      render(<BlockedInformationCard title={TITLE} subTitle={SUB_TITLE} description={DESCRIPTION} items={[]} />)
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
