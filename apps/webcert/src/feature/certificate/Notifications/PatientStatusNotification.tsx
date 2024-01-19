import styled from 'styled-components'
import InfoBox from '../../../components/utils/InfoBox'

interface Props {
  status: boolean
  title: string
  type: 'info' | 'error' | 'success' | 'observe' | 'protected_person' | 'deceased'
}

const Wrapper = styled.div`
  width: fit-content;
  margin-right: 10px;
  text-align: center;
`

const PatientStatusNotification: React.FC<Props> = ({ status, title, type }) => {
  if (!status) return null

  return (
    <Wrapper>
      <InfoBox type={type}>
        <p>{title}</p>
      </InfoBox>
    </Wrapper>
  )
}

export default PatientStatusNotification
