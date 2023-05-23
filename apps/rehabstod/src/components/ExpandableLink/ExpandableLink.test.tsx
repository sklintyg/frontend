import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExpandableLink } from './ExpandableLink'

const TITLE = 'TITLE'

const renderComponent = () => {
  render(
    <ExpandableLink title={TITLE}>
      <p>Children</p>
    </ExpandableLink>
  )
}
describe('ExpandableLink', () => {
  it('should render without issues', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title if not expanded', () => {
    renderComponent()
    expect(screen.getByText(TITLE)).toBeInTheDocument()
  })

  it('should show title if expanded', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByText(TITLE)).toBeInTheDocument()
  })

  it('should show children if expanded', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Children')).toBeInTheDocument()
  })

  it('should not show children if not expanded', async () => {
    renderComponent()
    expect(screen.queryByText('Children')).not.toBeInTheDocument()
  })

  it('should close expandable if clicking twice', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByRole('button'))
    expect(screen.queryByText('Children')).not.toBeInTheDocument()
  })
})
