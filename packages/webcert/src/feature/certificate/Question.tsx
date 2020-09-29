import * as React from 'react'
import { useSelector } from 'react-redux'
import UeRadio from './UeRadio'
import UeTextArea from './UeTextArea'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles'
import { UvText, CertificateDataConfig, CertificateDataElement } from '@frontend/common'
import { getQuestion } from '../../store/certificate/certificateSelectors'
import grey from '@material-ui/core/colors/grey'
import { useEffect, useState } from 'react'
import QuestionWrapper from './QuestionWrapper'
import ArrowUp from './utils/ArrowUp'
import { Expandable } from '@frontend/common/src'

const useStyles = makeStyles((theme) => ({
  accordion: {
    boxShadow: 'none',
    padding: '0',
    marginTop: '0',
  },
  accordionSummary: {
    padding: '0',
    minHeight: 0,
  },
  accordionDetails: {
    background: grey[300],
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
  },
  mandatoryIcon: {
    marginLeft: `-${theme.spacing(2)}px`,
    position: 'absolute',
    color: '#da4453',
    fontSize: '1.5rem',
  },
  heading: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  accordionContent: {
    margin: 0,
  },
  expandMoreIcon: {
    padding: `0`,
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

  return (
    <Expandable isExpanded={question.visible} additionalStyles={'questionWrapper'}>
      <QuestionWrapper>
        {getQuestionComponent(question.config, question.mandatory, question.readOnly)}
        {question.readOnly ? getUnifiedViewComponent(question) : getUnifiedEditComponent(question)}
      </QuestionWrapper>
    </Expandable>
  )

  function getQuestionComponent(config: CertificateDataConfig, mandatory: boolean, readOnly: boolean) {
    if (!readOnly && config.description) {
      return (
        <Accordion className={classes.accordion}>
          <AccordionSummary
            classes={{ content: classes.accordionContent, expandIcon: classes.expandMoreIcon }}
            className={classes.accordionSummary}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header">
            {!readOnly && mandatory && <span className={classes.mandatoryIcon}>*</span>}
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

  function getUnifiedEditComponent(question: CertificateDataElement) {
    if (question.config.component === 'ue-radio') return <UeRadio key={question.id} question={question} />
    if (question.config.component === 'ue-textarea') return <UeTextArea key={question.id} question={question} />
    return <div>Cannot find a component for: {question.config.component}</div>
  }

  function getUnifiedViewComponent(question: CertificateDataElement) {
    return <UvText question={question} />
  }
}

export default Question
