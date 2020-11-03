import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { getQuestion } from '../../../store/certificate/certificateSelectors'
import CategoryHeader from './CategoryHeader'
import CategoryTitle from './CategoryTitle'
import { Expandable } from '@frontend/common'

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
