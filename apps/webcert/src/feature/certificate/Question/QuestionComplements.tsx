import { isEqual } from 'lodash-es'
import styled from 'styled-components'
import { getComplementsForQuestions } from '../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../store/store'

const Complement = styled.div`
  display: flex;
  align-items: top;
  justify-content: space-between;
  padding: 5px;
`

const ComplementMessage = styled.div`
  white-space: pre-line;
`

export function QuestionComplements({ questionIds }: { questionIds: string[] }) {
  const complements = useAppSelector(getComplementsForQuestions(questionIds), isEqual)
  return (
    <>
      {complements.map((complement, index) => (
        <div key={index} className="ic-alert ic-alert--status ic-alert--info iu-p-none iu-my-400" data-testid="question-complement">
          <Complement>
            <i className="ic-alert__icon ic-info-icon iu-m-none" />
            <div className="iu-fullwidth iu-pl-300 iu-fs-200">
              <p className="iu-fw-heading">Kompletteringsbegäran:</p>
              <ComplementMessage>{complement.message}</ComplementMessage>
            </div>
          </Complement>
        </div>
      ))}
    </>
  )
}
