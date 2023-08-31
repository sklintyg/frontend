import { render, screen } from '@testing-library/react'
import { DiagnosisInfo } from './DiagnosisInfo'

describe('DiagnosisInfo', () => {
  it('should print unknown if diagnos is undefined', () => {
    render(<DiagnosisInfo diagnosis={undefined} biDiagnoses={[]} />)
    expect(screen.getByText('Okänt')).toBeInTheDocument()
  })

  it('should print unknown if diagnos is not set', () => {
    render(<DiagnosisInfo biDiagnoses={[]} />)
    expect(screen.getByText('Okänt')).toBeInTheDocument()
  })
})
