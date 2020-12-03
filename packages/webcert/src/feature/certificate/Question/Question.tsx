import * as React from 'react'
import { useSelector } from 'react-redux'
import UeRadio from '../Inputs/UeRadio'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles'
import { UvText, CertificateDataConfig, CertificateDataElement, MandatoryIcon, ConfigTypes } from '@frontend/common'
import { getIsLocked, getQuestion } from '../../../store/certificate/certificateSelectors'
import grey from '@material-ui/core/colors/grey'
import { useEffect, useRef, useState } from 'react'
import QuestionWrapper from './QuestionWrapper'
import ArrowUp from '../utils/ArrowUp'
import { Expandable } from '@frontend/common'
import UeTextArea from '../Inputs/UeTextArea'
import { ConfigUeRadioBoolean, ConfigUeTextArea } from './../../../../../common/src/types/certificate'

const useStyles = makeStyles((theme) => ({
  accordion: {
    boxShadow: 'none',
    padding: 0,
    marginTop: 0,
  },
  accordionSummary: {
    padding: 0,
    minHeight: 0,
  },
  accordionDetails: {
    background: grey[300],
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
  },
  heading: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  accordionContent: {
    margin: 0,
  },
  expandMoreIcon: {
    padding: 0,
    margin: 0,
    marginLeft: theme.spacing(2),
  },
}))

interface QuestionProps {
  id: string
}

const Question: React.FC<QuestionProps> = ({ id }) => {
  const question = useSelector(getQuestion(id))
  const classes = useStyles()
  const disabled = useSelector(getIsLocked)
  const expandableRef = useRef<null | HTMLDivElement>(null)
  const expandBtn = useRef<null | HTMLButtonElement>(null)
  const [expanded, setExpanded] = useState(false)
  // TODO: We keep this until we have fixed the useRef for the UeTextArea debounce-functionality. It need to update its ref everytime its props changes.
  if (!question || (!question.visible && !question.readOnly)) return null

  const toggleExpanded = () => {
    const btn = expandBtn.current
    const item = expandableRef.current

    if (!btn || !item) return

    btn.setAttribute('aria-expanded', item.classList.contains('ic-expandable--expanded') ? 'false' : 'true')
    item.classList.toggle('ic-expandable--expanded')
  }

  return (
    <Expandable isExpanded={question.visible} additionalStyles={'questionWrapper'}>
      <QuestionWrapper>
        {getQuestionComponent(question.config, question.mandatory, question.readOnly, disabled)}
        {question.readOnly ? getUnifiedViewComponent(question) : getUnifiedEditComponent(question, disabled)}
      </QuestionWrapper>
    </Expandable>
  )

  function getQuestionComponent(config: CertificateDataConfig, mandatory: boolean, readOnly: boolean, disabled: boolean) {
    if (disabled) {
      return (
        <Typography className={`questionTitle ${classes.heading}`} variant="subtitle1">
          {question.config.text}
        </Typography>
      )
    }

    if (!readOnly && config.description) {
      return (
        <div className="ic-expandable" ref={expandableRef}>
          <h4 className={`iu-fs-300 iu-fw-body iu-color-black questionTitle ${classes.heading}`}>
            <button
              onClick={toggleExpanded}
              ref={expandBtn}
              className="ic-expandable-button ic-inner ic-expandable-button--chevron"
              aria-controls="content-1"
              aria-expanded="false"
              type="button">
              {question.config.text}
              <span className="ic-expandable-button__icon">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="iu-svg-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="15"
                  viewBox="0 0 22 15">
                  <path
                    fill="currentColor"
                    d="M8.325 10.647L.585 3.259c-.78-.746-.78-1.954 0-2.7.782-.745 2.048-.745 2.83 0l9.153 8.738c.781.745.781 1.954 0 2.7l-9.154 8.737c-.78.746-2.047.746-2.828 0-.781-.745-.781-1.954 0-2.7l7.74-7.387z"
                    transform="translate(-1290 -179) translate(410 141) rotate(90 432 470)"
                  />
                </svg>
              </span>
            </button>
          </h4>
          <div id="content-1" className="ic-expandable__content ic-expandable-target">
            <div className="iu-bg-grey-300 iu-p-200 iu-mt-300">{question.config.description}</div>
          </div>
        </div>
      )
    }
    return (
      <Typography className={`questionTitle ${classes.heading}`} variant="subtitle1">
        {question.config.text}
      </Typography>
    )
  }

  function getUnifiedEditComponent(question: CertificateDataElement, disabled: boolean) {
    if (question.config.type === ConfigTypes.UE_RADIO_BOOLEAN) return <UeRadio disabled={disabled} key={question.id} question={question} />
    if (question.config.type === ConfigTypes.UE_TEXTAREA) return <UeTextArea disabled={disabled} key={question.id} question={question} />
    return <div>Cannot find a component for: {question.config.type}</div>
  }

  function getUnifiedViewComponent(question: CertificateDataElement) {
    return <UvText question={question} />
  }
}

export default Question
