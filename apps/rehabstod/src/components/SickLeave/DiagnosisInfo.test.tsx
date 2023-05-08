import { render, screen } from '@testing-library/react'
import { DiagnosisInfo } from './DiagnosisInfo'

describe('DiagnosisInfo', () => {
  it('should print unknown if diagnos is undefined', () => {
    render(<DiagnosisInfo diagnos={undefined} biDiagnoser={[]} />)
    expect(screen.getByText('Okänt')).toBeInTheDocument()
  })

  it('should print unknown if diagnos is not set', () => {
    render(<DiagnosisInfo biDiagnoser={[]} />)
    expect(screen.getByText('Okänt')).toBeInTheDocument()
  })
})
