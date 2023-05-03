import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExpandableCard } from './ExpandableCard'

const SUB_TITLE = 'Sub title'
const DESCRIPTION = 'Description'

const renderComponent = () => {
  render(
    <ExpandableCard subTitle={SUB_TITLE} description={DESCRIPTION}>
      <p>Children</p>
    </ExpandableCard>
  )
}

describe('ExpandableCard', () => {
  it('should render component without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  describe('not expanded', () => {
    it('should not show sub title if not expanded', () => {
      renderComponent()
      expect(screen.queryByText(SUB_TITLE)).not.toBeInTheDocument()
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

      it('should show children', () => {
        expect(screen.getByText('Children')).toBeInTheDocument()
      })

      it('should not show description', () => {
        expect(screen.queryByText(DESCRIPTION)).not.toBeInTheDocument()
      })

      it('should show sub title', () => {
        expect(screen.getByText(SUB_TITLE)).toBeInTheDocument()
      })
    })
  })
})
