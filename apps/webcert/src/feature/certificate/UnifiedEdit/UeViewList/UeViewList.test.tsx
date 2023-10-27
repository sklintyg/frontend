import { CertificateDataValueType, fakeViewListElement } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import UeViewList from './UeViewList'

const mockQuestion = fakeViewListElement({
  id: '1',
  value: {
    list: [
      { type: CertificateDataValueType.VIEW_TEXT, text: 'row1' },
      { type: CertificateDataValueType.VIEW_TEXT, text: 'row2' },
      { type: CertificateDataValueType.VIEW_TEXT, text: 'row3' },
    ],
  },
})['1']

it('renders component with correct default values', () => {
  render(<UeViewList question={mockQuestion} />)
  expect(screen.getByText('row1')).toBeInTheDocument()
  expect(screen.getByText('row2')).toBeInTheDocument()
  expect(screen.getByText('row3')).toBeInTheDocument()
})
