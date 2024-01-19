import { render, screen } from '@testing-library/react'
import UeViewText from './UeViewText'
import { fakeViewTextElement } from '../../../../faker'

const mockQuestion = fakeViewTextElement({ id: '1', value: { text: 'Text' } })['1']

it('renders component with correct default values', () => {
  render(<UeViewText question={mockQuestion} />)
  expect(screen.getByText('Text')).toBeInTheDocument()
})
