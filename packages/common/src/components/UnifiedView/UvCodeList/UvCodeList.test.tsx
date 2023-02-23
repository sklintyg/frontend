import { render, screen } from '@testing-library/react'
import React, { ComponentProps } from 'react'
import { CertificateDataValueType, ConfigLayout, ConfigUeCheckboxMultipleCodes, ValueCodeList } from '../../../types'
import { fakeCheckboxMultipleCodeElement } from '../../../utils'
import { UvCodeList } from './UvCodeList'

const QUESTION_ID = 'questionId'

const getQuestion = (layout: ConfigLayout) => {
  return fakeCheckboxMultipleCodeElement({
    id: QUESTION_ID,
    config: {
      layout: layout,
      list: [
        { label: 'label1', id: '1' },
        { label: 'label2', id: '2' },
      ],
    },
    value: {
      list: [
        { type: CertificateDataValueType.CODE, code: '1', id: '1' },
        { type: CertificateDataValueType.CODE, code: '2', id: '2' },
      ],
    },
  })[QUESTION_ID]
}

const renderComponent = (props: ComponentProps<typeof UvCodeList>) => {
  render(<UvCodeList {...props} />)
}

describe('UV Code list', () => {
  describe('With layout inline', () => {
    const question = getQuestion(ConfigLayout.INLINE)
    const value = question.value as ValueCodeList
    const config = question.config as ConfigUeCheckboxMultipleCodes

    it('should render without crashing', () => {
      expect(() => renderComponent({ value: value, config: config })).not.toThrow()
    })

    it('should not render list', () => {
      renderComponent({ value: value, config: config })
      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })

    it('should render list item', () => {
      renderComponent({ value: value, config: config })
      expect(screen.getByText(config.list[0].label, { exact: false })).toBeInTheDocument()
    })

    it('should render comma between items', () => {
      renderComponent({ value: value, config: config })
      expect(screen.getByText(',', { exact: false })).toBeInTheDocument()
    })

    it('should not render comma for last list item', () => {
      renderComponent({ value: value, config: config })
      expect(screen.getAllByText(',', { exact: false })).toHaveLength(1)
    })

    it('should render second list item', () => {
      renderComponent({ value: value, config: config })
      expect(screen.getByText(config.list[1].label)).toBeInTheDocument()
    })
  })

  describe('With layout column', () => {
    const question = getQuestion(ConfigLayout.COLUMN)
    const value = question.value as ValueCodeList
    const config = question.config as ConfigUeCheckboxMultipleCodes

    it('should render without crashing', () => {
      expect(() => renderComponent({ value: value, config: config })).not.toThrow()
    })

    it('should render list', () => {
      renderComponent({ value: value, config: config })
      expect(screen.queryByRole('list')).toBeInTheDocument()
    })

    it('should render list items', () => {
      renderComponent({ value: value, config: config })
      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })

    it('should render list item label', () => {
      renderComponent({ value: value, config: config })
      expect(screen.getByText(config.list[0].label, { exact: false })).toBeInTheDocument()
    })
  })
})
