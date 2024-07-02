import { render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { fakeResourceLink } from '../../../faker'
import { CannotComplementOption, ResourceLinkType } from '../../../types'
import { CannotComplementTextarea } from './CannotComplementTextarea'

function renderComponent(props: ComponentProps<typeof CannotComplementTextarea>) {
  render(<CannotComplementTextarea {...props} />)
}

describe('CANNOT_COMPLEMENT_CERTIFICATE', () => {
  it('Should display correct information when NO_FURTHER_MED_INFO is selected', () => {
    renderComponent({
      option: CannotComplementOption.NO_FURTHER_MED_INFO,
      message: '',
      onChange: vi.fn(),
      link: fakeResourceLink({ type: ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE }),
    })
    expect(screen.getByText(/kommentera varför det inte är möjligt att ange ytterligare medicinsk information/i)).toBeInTheDocument()
  })

  it('Should display correct information when NO_RESP_MEDICAL_CONTENT is selected', () => {
    renderComponent({
      option: CannotComplementOption.NO_RESP_MEDICAL_CONTENT,
      message: '',
      onChange: vi.fn(),
      link: fakeResourceLink({ type: ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE }),
    })
    expect(screen.getByText(/om intygsutfärdaren inte längre finns tillgänglig och ingen annan på vårdenheten/i)).toBeInTheDocument()
  })
})
