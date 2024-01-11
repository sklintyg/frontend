import { fakeViewTextElement } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import UeViewText from './UeViewText'

const mockQuestion = fakeViewTextElement({ id: '1', value: { text: 'Text' } })['1']

it('renders component with correct default values', () => {
  render(<UeViewText question={mockQuestion} />)
  expect(screen.getByText('Text')).toBeInTheDocument()
})
