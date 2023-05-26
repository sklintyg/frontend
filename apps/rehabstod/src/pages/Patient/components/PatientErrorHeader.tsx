import { IDSButton, IDSContainer } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'

export function PatientErrorHeader() {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/pagaende-sjukfall')
  }
  return (
    <div className="bg-secondary-95 sticky top-0 z-30 shadow-[0_2px_6px_0_rgba(0,0,0,0.15)]">
      <IDSContainer>
        <div className="flex items-center space-x-2 py-4">
          <div className="grow" />
          <IDSButton onClick={handleClick} tertiary>
            STÄNG PATIENTVYN
          </IDSButton>
        </div>
      </IDSContainer>
    </div>
  )
}
