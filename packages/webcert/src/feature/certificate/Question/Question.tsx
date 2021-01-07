import * as React from 'react'
import { useSelector } from 'react-redux'
import UeRadio from '../Inputs/UeRadio'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles'
import { UvText, CertificateDataConfig, CertificateDataElement, MandatoryIcon, ConfigTypes } from '@frontend/common'
import { getIsLocked, getQuestion } from '../../../store/certificate/certificateSelectors'
import grey from '@material-ui/core/colors/grey'
import { useEffect, useState } from 'react'
import QuestionWrapper from './QuestionWrapper'
import ArrowUp from '../utils/ArrowUp'
import { Expandable } from '@frontend/common'
import UeTextArea from '../Inputs/UeTextArea'
import { ConfigUeRadioBoolean, ConfigUeTextArea } from './../../../../../common/src/types/certificate'
import UeCheckboxGroup from '../Inputs/UeCheckboxGroup'
import UeCheckbox from '../Inputs/UeCheckbox'
import UeDropdown from '../Inputs/UeDropdown'
import UeRadioGroup from '../Inputs/UeRadioGroup'

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
  const disabled = useSelector(getIsLocked) || (question.disabled as boolean)

  // TODO: We keep this until we have fixed the useRef for the UeTextArea debounce-functionality. It need to update its ref everytime its props changes.
  if (!question || (!question.visible && !question.readOnly)) return null

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
        <Accordion className={classes.accordion}>
          <AccordionSummary
            classes={{ content: classes.accordionContent, expandIcon: classes.expandMoreIcon }}
            className={classes.accordionSummary}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header">
            <MandatoryIcon display={!readOnly && mandatory && !disabled}></MandatoryIcon>
            <Typography className={`questionTitle ${classes.heading}`} variant="subtitle1">
              {question.config.text}
            </Typography>
          </AccordionSummary>
          <ArrowUp></ArrowUp>
          <AccordionDetails className={classes.accordionDetails}>
            <Typography>{question.config.description}</Typography>
          </AccordionDetails>
        </Accordion>
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
    if (question.config.type === ConfigTypes.UE_CHECKBOX_BOOLEAN)
      return <UeCheckbox disabled={disabled} key={question.id} question={question} />
    if (question.config.type === ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE)
      return <UeCheckboxGroup question={question} disabled={disabled} key={question.id} />
    if (question.config.type === ConfigTypes.UE_DROPDOWN) return <UeDropdown disabled={disabled} key={question.id} question={question} />
    if (question.config.type === ConfigTypes.UE_RADIO_MULTIPLE_CODE)
      return <UeRadioGroup disabled={disabled} key={question.id} question={question} />
    return <div>Cannot find a component for: {question.config.type}</div>
  }

  function getUnifiedViewComponent(question: CertificateDataElement) {
    return <UvText question={question} />
  }
}

export default Question
