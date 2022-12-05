import { Accordion, Expandable, MandatoryIcon } from '@frontend/common'
import _ from 'lodash'
import React from 'react'
import { useSelector } from 'react-redux'
import { css } from 'styled-components'
import { getQuestion } from '../../../store/certificate/certificateSelectors'
import CategoryHeader from './CategoryHeader'
import CategoryTitle from './CategoryTitle'

interface CategoryProps {
  id: string
}
const mandatoryIconAdditionalStyles = css`
  top: -5px;
`

const Category: React.FC<CategoryProps> = ({ id }) => {
  const category = useSelector(getQuestion(id), _.isEqual)
  const displayMandatory = (!category?.readOnly && category?.mandatory && !category.disabled) ?? false

  if (!category) return null

  const isEditable = !category.readOnly && !category.disabled
  const showTitleWithDescription = !!category.config.description && isEditable

  return (
    <Expandable isExpanded={category.visible} additionalStyles={'categoryWrapper'}>
      <CategoryHeader>
        {showTitleWithDescription ? (
          <Accordion
            titleId={category.id}
            title={category.config.text}
            description={category.config.description}
            isCategory={true}
            displayMandatory={displayMandatory}
          />
        ) : (
          <>
            <MandatoryIcon additionalStyles={mandatoryIconAdditionalStyles} display={displayMandatory} />
            <CategoryTitle titleId={category.id}>{category.config.text}</CategoryTitle>
          </>
        )}
      </CategoryHeader>
    </Expandable>
  )
}

export default Category
