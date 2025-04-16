import { render, screen } from '@testing-library/react'
import { UvDateRange } from './UvDateRange'
import '@testing-library/jest-dom/extend-expect'
import { CertificateDataValueType, ConfigTypes } from '../../../types'

describe('UvDateRange', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <UvDateRange
        value={{ from: '', to: '', type: CertificateDataValueType.DATE_RANGE, id: 'value-id' }}
        config={{
          id: 'config-id',
          type: ConfigTypes.UE_DATE_RANGE,
          fromLabel: 'From',
          toLabel: 'To',
          text: 'Select a date range',
          description: 'Date range description',
        }}
      />
    )
    expect(container).toBeInTheDocument()
  })

  it('should display "Ej angivet" when from and to values are empty', () => {
    render(
      <UvDateRange
        value={{ from: '', to: '', type: CertificateDataValueType.DATE_RANGE, id: 'value-id' }}
        config={{
          id: 'config-id',
          type: ConfigTypes.UE_DATE_RANGE,
          fromLabel: 'From',
          toLabel: 'To',
          text: 'Select a date range',
          description: 'Date range description',
        }}
      />
    )
    expect(screen.getAllByText('Ej angivet')).toHaveLength(2)
  })

  it('should display provided from and to values', () => {
    render(
      <UvDateRange
        value={{ from: '2023-01-01', to: '2023-12-31', type: CertificateDataValueType.DATE_RANGE, id: 'value-id' }}
        config={{
          id: 'config-id',
          type: ConfigTypes.UE_DATE_RANGE,
          fromLabel: 'From',
          toLabel: 'To',
          text: 'Select a date range',
          description: 'Date range description',
        }}
      />
    )
    expect(screen.getByText('2023-01-01')).toBeInTheDocument()
    expect(screen.getByText('2023-12-31')).toBeInTheDocument()
  })
})
