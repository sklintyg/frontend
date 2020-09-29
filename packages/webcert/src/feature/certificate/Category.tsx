import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Accordion, AccordionDetails, AccordionSummary, Typography, Paper, Collapse } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles'
import { getQuestion } from '../../store/certificate/certificateSelectors'
import CategoryHeader from './CategoryHeader'
import { grey } from '@material-ui/core/colors'
import CategoryTitle from './CategoryTitle'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: `${theme.spacing(2)}px`,
    paddingBottom: `${theme.spacing(2)}px`,
    marginTop: `${theme.spacing(2)}px`,
    borderBottom: `2px solid ${grey[300]}`,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  heading: {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.h6.fontSize,
  },
}))
import { Expandable } from '@frontend/common/src'

interface CategoryProps {
  id: string
}

const Category: React.FC<CategoryProps> = ({ id }) => {
  const category = useSelector(getQuestion(id))

  return (
    <Expandable isExpanded={category.visible} additionalStyles={'categoryWrapper'}>
      <CategoryHeader>
        {category.config.description && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <CategoryTitle titleId={category.id}>{category.config.text}</CategoryTitle>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{category.config.description}</Typography>
            </AccordionDetails>
          </Accordion>
        )}
        {!category.config.description && <CategoryTitle titleId={category.id}>{category.config.text}</CategoryTitle>}
      </CategoryHeader>
    </Expandable>
  )
}

export default Category
