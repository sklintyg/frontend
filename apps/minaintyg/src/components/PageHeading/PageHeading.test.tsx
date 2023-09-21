import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PageHeading } from './PageHeading'

it('Should render correctly', () => {
  const { baseElement } = render(<PageHeading heading="Test">Lorem ipsum</PageHeading>)
  expect(baseElement).toMatchSnapshot()
})

it('Should remove clamped when show more button is pressed', async () => {
  render(<PageHeading heading="Test">Lorem ipsum</PageHeading>)
  expect(screen.getByText('Lorem ipsum')).toHaveAttribute('data-clamped', 'true')
  await userEvent.click(screen.getByRole('button', { name: 'Visa mer text' }))
  expect(screen.getByText('Lorem ipsum')).toHaveAttribute('data-clamped', 'false')
})
