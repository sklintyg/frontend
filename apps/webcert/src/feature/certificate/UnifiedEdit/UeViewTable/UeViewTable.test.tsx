import { CertificateDataValueType, fakeViewTableElement } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import UeViewTable from "./UeViewTable"

const mockQuestion = fakeViewTableElement({
  id: '1',
  config: {
    columns: [
      { id: 'c1', text: 'column1' },
      { id: 'c2', text: 'column2' },
      { id: 'c3', text: 'column3' },
    ],
  },
  value: {
    rows: [
      {
        type: CertificateDataValueType.VIEW_ROW,
        columns: [
          { type: CertificateDataValueType.TEXT, id: 'c1', text: 'r1c1' },
          { type: CertificateDataValueType.TEXT, id: 'c2', text: 'r1c2' },
          { type: CertificateDataValueType.TEXT, id: 'c3', text: 'r1c3' },
        ],
      },
      {
        type: CertificateDataValueType.VIEW_ROW,
        columns: [
          { type: CertificateDataValueType.TEXT, id: 'c1', text: 'r2c1' },
          { type: CertificateDataValueType.TEXT, id: 'c2', text: 'r2c2' },
          { type: CertificateDataValueType.TEXT, id: 'c3', text: 'r2c3' },
        ],
      },
      {
        type: CertificateDataValueType.VIEW_ROW,
        columns: [
          { type: CertificateDataValueType.TEXT, id: 'c1', text: 'r3c1' },
          { type: CertificateDataValueType.TEXT, id: 'c2', text: 'r3c2' },
          { type: CertificateDataValueType.TEXT, id: 'c3', text: 'r3c3' },
        ],
      },
    ],
  },
})['1']

it('renders component with correct default values', () => {
  render(<UeViewTable question={mockQuestion} />)
  expect(screen.getByText('r1c1')).toBeInTheDocument()
  expect(screen.getByText('r1c2')).toBeInTheDocument()
  expect(screen.getByText('r1c3')).toBeInTheDocument()
  expect(screen.getByText('r2c1')).toBeInTheDocument()
  expect(screen.getByText('r2c2')).toBeInTheDocument()
  expect(screen.getByText('r2c3')).toBeInTheDocument()
  expect(screen.getByText('r3c1')).toBeInTheDocument()
  expect(screen.getByText('r3c2')).toBeInTheDocument()
  expect(screen.getByText('r3c3')).toBeInTheDocument()
})
