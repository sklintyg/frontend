import * as React from 'react'
import { useSelector } from 'react-redux'
import UeRadio from './UeRadio'
import UeTextArea from './UeTextArea'
import { Accordion, AccordionDetails, AccordionSummary, Typography, Paper, Collapse } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles'
import { UvText, CertificateDataConfig, CertificateDataElement } from '@frontend/common'
import { getQuestion } from '../../store/selectors/certificate'
import grey from '@material-ui/core/colors/grey'
import { useEffect, useState } from 'react'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
  },
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
  arrowUp: {
    width: '0',
    height: '0',
    content: ' ',
    left: '35px',
    marginLeft: '35px',
    borderWidth: '10px',
    borderHeight: '10px',
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderBottom: '10px solid',
    borderBottomColor: grey[300],
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
  },
}))

interface QuestionProps {
  id: string
}

const Question: React.FC<QuestionProps> = ({ id }) => {
  const question = useSelector(getQuestion(id))
  const [mounted, setMounted] = useState(question.visible)

  const classes = useStyles()

  useEffect(() => {
    setMounted(question.visible)
  }, [question.visible])

  if (!question || (!question.visible && !question.readOnly)) return null

  return (
    <Collapse className={`questionWrapper`} in={mounted} timeout={750} exit={true}>
      <Paper square className={`${classes.root}`}>
        {getQuestionComponent(question.config, question.mandatory, question.readOnly)}
        {question.readOnly ? getUnifiedViewComponent(question) : getUnifiedEditComponent(question)}
      </Paper>
    </Collapse>
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
          <div className={classes.arrowUp}></div>
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
