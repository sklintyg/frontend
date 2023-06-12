import { Accordion, AccordionHeader, MandatoryIcon, sanitizeText, Text } from '@frontend/common'
import _ from 'lodash'
import React from 'react'
import { useSelector } from 'react-redux'
import { getQuestion } from '../../../store/certificate/certificateSelectors'
import CategoryHeader from './CategoryHeader'
import CategoryTitle from './CategoryTitle'

interface CategoryProps {
  id: string
}

const Category: React.FC<CategoryProps> = ({ id }) => {
  const category = useSelector(getQuestion(id), _.isEqual)
  const displayMandatory = (!category?.readOnly && category?.mandatory && !category.disabled) ?? false

  if (!category) return null

  const isEditable = !category.readOnly && !category.disabled
  const showTitleWithDescription = !!category.config.description && isEditable

  return category.visible ? (
    <CategoryHeader>
      {showTitleWithDescription ? (
        <div id={category.id}>
          <Accordion>
            <AccordionHeader>
              {displayMandatory && <MandatoryIcon />}
              <h3 className={'iu-fs-400  iu-fw-heading'}>{category.config.text}</h3>
            </AccordionHeader>
            <Text className={'iu-mb-400'} dangerouslySetInnerHTML={sanitizeText(category.config.description)}></Text>
          </Accordion>
        </div>
      ) : (
        <CategoryTitle titleId={category.id}>{category.config.text}</CategoryTitle>
      )}
    </CategoryHeader>
  ) : null
}

export default Category
