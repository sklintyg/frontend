import { render, screen } from '@testing-library/react'
import { FMBDiagnosisCodeInfoFormContentHeading } from '../../types'
import FMBPanelGuidanceInfo from './FMBPanelGuidanceInfo'

describe('FMBPanelGuidanceInfo', () => {
  it('should show text if avaialble', () => {
    render(<FMBPanelGuidanceInfo info={{ heading: FMBDiagnosisCodeInfoFormContentHeading.FMB_GENERAL_INFO, text: 'text' }} />)

    expect(screen.getByText('text')).toBeInTheDocument()
  })

  it('should show list text if avaialble', () => {
    render(<FMBPanelGuidanceInfo info={{ heading: FMBDiagnosisCodeInfoFormContentHeading.FMB_GENERAL_INFO, list: ['1', '2'] }} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
