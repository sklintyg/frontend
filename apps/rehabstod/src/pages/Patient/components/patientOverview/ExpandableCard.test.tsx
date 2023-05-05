import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
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

    describe('local expanded', () => {
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

    it('should expand if expandable as property is sent as true', () => {
      render(
        <ExpandableCard description={DESCRIPTION} subTitle={SUB_TITLE} expanded>
          Children
        </ExpandableCard>
      )
      expect(screen.getByText(SUB_TITLE)).toBeInTheDocument()
    })
  })

  it('should call on expanded if sent as property and clicked on show', async () => {
    const onExpand = vi.fn()
    render(
      <ExpandableCard description={DESCRIPTION} subTitle={SUB_TITLE} onExpand={onExpand}>
        Children
      </ExpandableCard>
    )

    await userEvent.click(screen.getByText('Visa'))
    expect(onExpand).toHaveBeenCalledTimes(1)
  })
})
